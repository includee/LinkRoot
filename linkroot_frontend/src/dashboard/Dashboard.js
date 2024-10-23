import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { LinksContext } from "../context/LinksContext";
import { BiSolidTrash, BiEdit, BiLinkExternal, BiQr } from "react-icons/bi";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { QRCodeCanvas } from "qrcode.react"; // Import QR Code generator

export default function Dashboard() {
  const { createGroup, getAllLinks, linkGroups, linksLoading, deleteGroup } =
    useContext(LinksContext);

  const [name, setName] = useState("");
  const [groups, setGroups] = useState(linkGroups || []); // Ensure default value is an array
  const [selectedGroupQR, setSelectedGroupQR] = useState(null); // State to manage QR Code modal
  const qrCodeRef = useRef(); // Ref to access the QR Code canvas element
  const navigate = useNavigate();

  useEffect(() => {
    const check = () => {
      const isAuth = localStorage.getItem("isAuthenticated");
      if (isAuth == null) {
        navigate("/login");
      }
    };
    check();
  }, []);

  useEffect(() => {
    getAllLinks();
  }, []);

  useEffect(() => {
    setGroups(linkGroups); // Sync state when linkGroups updates
  }, [linkGroups]);

  const create = async () => {
    if (name !== "") {
      const id = await createGroup(name);
      navigate(`/dashboard/${id}/edit`);
    }
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedGroups = Array.from(groups);
    const [movedGroup] = reorderedGroups.splice(result.source.index, 1);
    reorderedGroups.splice(result.destination.index, 0, movedGroup);

    setGroups(reorderedGroups);
    // Optionally save the new order to the backend
  };

  const openQRModal = (uniqueString) => {
    setSelectedGroupQR(uniqueString); // Set the selected group for which QR will be shown
    document.getElementById("qr_modal").showModal();
  };

  const downloadQRCode = () => {
    const qrCanvas = qrCodeRef.current.querySelector("canvas");
    const pngUrl = qrCanvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${selectedGroupQR}_QRCode.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  if (linksLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  } else {
    return (
      <div className="h-full w-full p-5 mt-20">
        <div className="flex w-full justify-between items-center">
          <h1 className="text-4xl font-semibold">Dashboard</h1>

          <button
            className="btn btn-success text-white btn-md hover:scale-105 transition-transform duration-300"
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            Create
          </button>
        </div>
        <div className="divider"></div>

        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Create Group</h3>
            <input
              className="input input-bordered w-full max-w-xs my-2"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="modal-action w-full">
              <form method="dialog" className="flex gap-3">
                <button
                  className="btn w-full btn-primary hover:bg-blue-600 transition-colors duration-300"
                  onClick={create}
                >
                  Create
                </button>
              </form>
            </div>
          </div>
        </dialog>

        {/* QR Code Modal */}
        <dialog id="qr_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-center">Your LinkRoot</h3>
            <div className="flex items-center gap-4 justify-center items-center" ref={qrCodeRef}>
              {selectedGroupQR && (
                <>
                  {/* QR Code */}
                  <QRCodeCanvas
                    value={`http://yourdomain.com/r/${selectedGroupQR}`}
                    size={150}
                    style={{ position: "relative", zIndex: 1 }}
                  />
                </>
              )}
              
            </div>
            <div className="modal-action flex gap-4 justify-center items-center">
              <button className="btn btn-primary" onClick={downloadQRCode}>
                Download QR Code
              </button>
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>

        <div className="h-full w-full">
          {groups.length > 0 ? (
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="groups">
                {(provided) => (
                  <div
                    className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {groups.map((linkGroup, index) => (
                      <Draggable
                        key={linkGroup.id.toString()} // Ensure draggableId is a string
                        draggableId={linkGroup.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="w-full transform hover:scale-105 transition-transform duration-300"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="h-28 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-t-lg"></div>
                            <div className="w-full p-4 rounded shadow border flex flex-col items-center justify-center bg-white">
                              <h1 className="text-center font-bold text-lg">
                                {linkGroup.name}
                              </h1>
                              <div className="flex gap-3 justify-center items-center mt-5">
                                <a
                                  href={`/r/${linkGroup.unique_string}`}
                                  target="_blank"
                                  className="btn text-white btn-success btn-xs hover:scale-110 transition-transform duration-300"
                                >
                                  <BiLinkExternal />
                                </a>
                                <Link
                                  className="btn text-white btn-warning btn-xs hover:scale-110 transition-transform duration-300"
                                  to={`${linkGroup.id}/edit`}
                                >
                                  <BiEdit />
                                </Link>
                                <button
                                  onClick={() => deleteGroup(linkGroup.id)}
                                  className="btn text-white btn-error btn-xs hover:scale-110 transition-transform duration-300"
                                >
                                  <BiSolidTrash />
                                </button>
                                {/* QR Code Button */}
                                <button
                                  onClick={() =>
                                    openQRModal(linkGroup.unique_string)
                                  }
                                  className="btn text-white btn-info btn-xs hover:scale-110 transition-transform duration-300"
                                >
                                  <BiQr />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <div className="h-full w-full flex justify-center items-center">
              <p>No Link Groups Found</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
