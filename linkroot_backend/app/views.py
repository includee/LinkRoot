import random
import string
import sys

from django.shortcuts import render
from django.db import transaction

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from .models import Link, LinkGroup
from .serializers import LinkSerializer, LinkGroupSerializer


# API view to handle operations on links within a specific group
class GroupLinksAPIView(APIView):
    permission_classes = [IsAuthenticated]  # Requires user to be authenticated
    authentication_classes = [TokenAuthentication]  # Uses token-based authentication

    # Handles GET requests to fetch link group and its links
    def get(self, request, group_id):
        try:
            user_id = request.user.id  # Get the ID of the authenticated user
            # Fetch the LinkGroup by ID, ensuring it belongs to the current user
            link_group = LinkGroup.objects.get(id=group_id, group_creator__id=user_id)
            link_group_serializer = LinkGroupSerializer(link_group)  # Serialize the LinkGroup data

            # Fetch all links associated with the fetched group
            links = Link.objects.filter(group=link_group)
            link_serializer = LinkSerializer(links, many=True)  # Serialize the Link data

            # Prepare response with serialized group and link data
            response = {
                'link_group': link_group_serializer.data,
                'links': link_serializer.data
            }
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            # Return 404 if the group or user is not found
            return Response({"Error": "Link Group or User not Found"}, status=status.HTTP_404_NOT_FOUND)

    # Handles POST requests to update or create links within a group
    def post(self, request, group_id):
        user_id = request.user.id  # Get the ID of the authenticated user

        try:
            # Fetch the LinkGroup to update, ensuring it belongs to the current user
            link_group = LinkGroup.objects.filter(id=group_id, group_creator__id=user_id).first()
            # Update the LinkGroup with provided data
            link_group_serializer = LinkGroupSerializer(link_group, data=request.data.get('link_group'), partial=True)
            link_group_serializer.is_valid(raise_exception=True)
            link_group_serializer.save(group_creator_id=user_id)

            links_data = request.data.get('links', [])  # Get the links data from the request

            # Get the IDs of the received links to identify which links to delete
            received_link_ids = [link_data.get('id') for link_data in links_data]

            # Delete links that are not in the received data
            Link.objects.filter(group=link_group).exclude(id__in=received_link_ids).delete()

            # Iterate over each link in the received data
            for link_data in links_data:
                link_id = link_data.get('id')  # Get the link ID
                if link_id is None:  # If no ID, create a new link
                    link_data['group'] = link_group.id
                    link_data['creator'] = user_id
                    link_serializer = LinkSerializer(data=link_data, partial=True)
                else:
                    # Fetch the existing link by ID if it exists
                    link = Link.objects.filter(id=link_id, group=link_group).first()
                    link_serializer = LinkSerializer(link, data=link_data, partial=True)

                link_serializer.is_valid(raise_exception=True)  # Validate the link data
                link_serializer.save()  # Save the link (create or update)

            # Fetch the updated links and serialize them
            updated_links = Link.objects.filter(group__id=group_id, group__group_creator__id=user_id)
            updated_links_group_serializer = LinkGroupSerializer(link_group)

            # Prepare response with updated group and link data
            response_data = {
                'link_group': updated_links_group_serializer.data,
                'links': LinkSerializer(updated_links, many=True).data
            }
            return Response(response_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            # Print the error details to console and return 404 error
            print('Error on line {}'.format(sys.exc_info()[-1].tb_lineno), type(e).__name__, e)
            return Response({"Error": "Link Group or User not Found " + str(e)}, status=status.HTTP_404_NOT_FOUND)


# API view to handle operations on link groups owned by the authenticated user
class UserLinkGroupAPIView(APIView):
    authentication_classes = [TokenAuthentication]  # Uses token-based authentication
    permission_classes = [IsAuthenticated]  # Requires user to be authenticated

    # Handles GET requests to fetch all link groups owned by the user
    def get(self, request):
        user_id = request.user.id  # Get the ID of the authenticated user
        # Fetch all link groups created by the user
        link_groups = LinkGroup.objects.filter(group_creator__id=user_id)
        serializer = LinkGroupSerializer(link_groups, many=True)  # Serialize the LinkGroup data
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Handles POST requests to create or update a link group
    def post(self, request, linkgroup_id=None):
        user_id = request.user.id  # Get the ID of the authenticated user

        if linkgroup_id:  # If an ID is provided, update the existing link group
            link_group = LinkGroup.objects.get(id=linkgroup_id, group_creator__id=user_id)
            serializer = LinkGroupSerializer(link_group, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        else:  # If no ID, create a new link group
            unique_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))  # Generate a unique string
            data = {'unique_string': unique_string, 'group_creator': user_id, **request.data}
            serializer = LinkGroupSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save(group_creator_id=user_id)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # Handles DELETE requests to delete a link group and its associated links
    def delete(self, request, linkgroup_id):
        user_id = request.user.id  # Get the ID of the authenticated user

        try:
            # Fetch the LinkGroup to delete, ensuring it belongs to the current user
            link_group = LinkGroup.objects.get(id=linkgroup_id, group_creator__id=user_id)
            with transaction.atomic():  # Use a transaction to ensure atomic deletion
                Link.objects.filter(group=link_group).delete()  # Delete all links in the group
                link_group.delete()  # Delete the group itself
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            # Return 404 if the group or user is not found
            return Response({"Error": "Link Group or User not Found"}, status=status.HTTP_404_NOT_FOUND)


# API view to handle public access to a specific link group based on a unique string
class GroupLinksPublicAPIView(APIView):
    authentication_classes = []  # No authentication required for public access
    permission_classes = [AllowAny]  # Allows any user (including unauthenticated) to access

    # Handles GET requests to fetch public link group data
    def get(self, request, unique_string):
        try:
            # Fetch the LinkGroup by its unique string
            link_group = LinkGroup.objects.get(unique_string=unique_string)
            link_group_serializer = LinkGroupSerializer(link_group)  # Serialize the LinkGroup data

            # Fetch all links associated with the fetched group
            links = Link.objects.filter(group=link_group)
            link_serializer = LinkSerializer(links, many=True)  # Serialize the Link data

            # Prepare response with serialized group and link data
            response = {
                'link_group': link_group_serializer.data,
                'links': link_serializer.data
            }
            return Response(response, status=status.HTTP_200_OK)
        except LinkGroup.DoesNotExist:
            # Return 404 if the group is not found
            return Response({"Error": "Link Group not Found"}, status=status.HTTP_404_NOT_FOUND)
