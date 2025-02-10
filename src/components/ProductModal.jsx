import { useEffect, useRef, useState } from 'react';
import { Modal } from 'bootstrap';
import ReactLoading from 'react-loading';

function ProductModal({ tempProduct, isProductModalOpen, setIsProductModalOpen, isScreenLoading, addCartItem, qtySelect, setQtySelect }) {

    const [modalData, setModalData] = useState(tempProduct);
    const productModalRef = useRef(null);

    useEffect(() => {
        new Modal(productModalRef.current, { backdrop: false });
    }, []);

    const closeModal = () => {
        const modalInstance = Modal.getInstance(productModalRef.current);
        modalInstance.hide();
        setIsProductModalOpen(false);
    };

    useEffect(() => {
        if (isProductModalOpen) {
            const modalInstance = Modal.getInstance(productModalRef.current);
            modalInstance.show();
        }else{
            const modalInstance = Modal.getInstance(productModalRef.current);
            modalInstance.hide();
        }
    }, [isProductModalOpen])

    useEffect(() => {
        setModalData({
            ...tempProduct
        })
    }, [tempProduct])

    return (
        <div
            ref={productModalRef}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            className="modal fade"
            id="productModal"
            tabIndex="-1"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title fs-5">
                            產品名稱：{modalData.title}
                        </h2>
                        <button
                            onClick={closeModal}
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <img
                            src={modalData.imageUrl}
                            alt={modalData.title}
                            className="img-fluid"
                        />
                        <p>內容：{modalData.content}</p>
                        <p>描述：{modalData.description}</p>
                        <p>
                            價錢：{modalData.price}{" "}
                            <del>{modalData.origin_price}</del> 元
                        </p>
                        <div className="input-group align-items-center">
                            <label htmlFor="qtySelect">數量：</label>
                            <select
                                value={qtySelect}
                                onChange={(e) => setQtySelect(e.target.value)}
                                id="qtySelect"
                                className="form-select"
                            >
                                {Array.from({ length: 10 }).map((_, index) => (
                                    <option key={index} value={index + 1}>
                                        {index + 1}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            onClick={
                                () => {
                                    addCartItem(modalData.id, qtySelect);
                                }
                            }
                            type="button"
                            className="btn btn-primary d-flex align-items-center gap-2" disabled={isScreenLoading}
                        >
                            加入購物車
                            {isScreenLoading &&
                                <ReactLoading
                                    type={"spin"}
                                    color={"#000"}
                                    height={"1.5rem"}
                                    width={"1.5rem"}
                                />
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductModal;