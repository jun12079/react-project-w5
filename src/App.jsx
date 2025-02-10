import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import ReactLoading from "react-loading";
import ProductModal from "./components/ProductModal";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
	const [products, setProducts] = useState([]);
	const [tempProduct, setTempProduct] = useState([]);
	const [cart, setCart] = useState({});
	const [isScreenLoading, setIsScreenLoading] = useState(false);
	const [isProductModalOpen, setIsProductModalOpen] = useState(false);
	const [qtySelect, setQtySelect] = useState(1);

	useEffect(() => {
		const getProducts = async () => {
			setIsScreenLoading(true);
			try {
				const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
				setProducts(res.data.products);
			} catch (error) {
				void error;
				alert("取得產品失敗");
			} finally {
				setIsScreenLoading(false);
			}
		};
		getProducts();
		getCart();
	}, []);

	const handleSeeMore = (product) => {
		setTempProduct(product);
		setIsProductModalOpen(true);
	};

	const getCart = async () => {
		try {
			const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
			setCart(res.data.data);
		} catch (error) {
			void error;
			alert("取得購物車失敗");
		}
	};

	const addCartItem = async (product_id, qty) => {
		setIsScreenLoading(true);
		try {
			await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
				data: {
					product_id,
					qty: Number(qty),
				},
			});
			getCart();
		} catch (error) {
			void error;
			alert("加入購物車失敗");
		} finally {
			setIsScreenLoading(false);
			setIsProductModalOpen(false);
			setQtySelect(1);
		}
	};

	const updateCartItem = async (cartItem_id, product_id, qty) => {
		setIsScreenLoading(true);
		try {
			await axios.put(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItem_id}`, {
				data: {
					product_id,
					qty: Number(qty),
				},
			});
			getCart();
		} catch (error) {
			void error;
			alert("更新購物車商品失敗");
		} finally {
			setIsScreenLoading(false);
		}
	}

	const removeCart = async () => {
		setIsScreenLoading(true);
		try {
			await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
			getCart();
		} catch (error) {
			void error;
			alert("刪除購物車失敗");
		} finally {
			setIsScreenLoading(false);
		}
	}

	const removeCartItem = async (id) => {
		setIsScreenLoading(true);
		try {
			await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${id}`);
			getCart();
		} catch (error) {
			void error;
			alert("刪除購物車項目失敗");
		} finally {
			setIsScreenLoading(false);
		}
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();

	const onSubmit = handleSubmit((data) => {
		console.log(data);
		const { message, ...user } = data;
		const userInfo = {
			data: {
				user: user,
				message,
			},
		}
		checkOut(userInfo);
	});

	const checkOut = async (data) => {
		setIsScreenLoading(true);
		try {
			await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, data);
			reset();
			getCart();
		} catch (error) {
			void error;
			alert("結帳失敗");
		} finally {
			setIsScreenLoading(false);
		}
	};

	return (
		<>
			<div className="container">
				<h3 className="mb-4">商品列表</h3>
				<div className="table-responsive">
					<table className="table align-middle">
						<thead>
							<tr>
								<th>商品圖片</th>
								<th>商品名稱</th>
								<th>價格</th>
								<th>功能</th>
							</tr>
						</thead>
						<tbody>
							{products.map((product) => {
								return (
									<tr key={product.id}>
										<td width="15%">
											<img src={product.imageUrl} className="img-thumbnail" alt="商品圖片" />
										</td>
										<td>{product.title}</td>
										<td>
											<del className="h6">原價 {product.origin_price} 元</del>
											<div className="h5">特價 {product.price} 元</div>
										</td>
										<td>
											<div className="d-flex">
												<button className="btn btn-outline-primary me-2" onClick={() => {
													handleSeeMore(product);
												}}>查看更多</button>
												<button
													onClick={
														() => {
															addCartItem(product.id, qtySelect);
														}
													}
													type="button"
													className="btn btn-primary d-flex" disabled={isScreenLoading}
												>
													{isScreenLoading &&
														<ReactLoading
															type={"spin"}
															color={"#000"}
															height={"1.5rem"}
															width={"1.5rem"}
														/>
													}
													加入購物車
												</button>
											</div>
										</td>
									</tr>
								);

							})}
						</tbody>
					</table>
				</div>
				<ProductModal
					tempProduct={tempProduct}
					isProductModalOpen={isProductModalOpen}
					setIsProductModalOpen={setIsProductModalOpen}
					isScreenLoading={isScreenLoading}
					addCartItem={addCartItem}
					qtySelect={qtySelect}
					setQtySelect={setQtySelect}
				/>
				{cart.carts?.length > 0 && (
					<div>
						<div className="d-flex justify-content-between align-items-center mb-3">
							<h3>購物車</h3>
							<button
								onClick={removeCart}
								className="btn btn-outline-danger">清空購物車
							</button>
						</div>
						<table className="table align-middle">
							<thead>
								<tr>
									<th></th>
									<th>品名</th>
									<th style={{ width: "150px" }}>數量/單位</th>
									<th className="text-end">單價</th>
								</tr>
							</thead>

							<tbody>
								{cart.carts?.map((cartItem) => {
									return (
										<tr key={cartItem.id}>
											<td>
												<button
													onClick={() => {
														removeCartItem(cartItem.id);
													}}
													type="button"
													className="btn btn-outline-danger btn-sm"
												>
													x
												</button>
											</td>
											<td>{cartItem.product.title}</td>
											<td style={{ width: "150px" }}>
												<div className="d-flex align-items-center">
													<div className="btn-group me-2" role="group">
														<button
															onClick={() => {
																updateCartItem(cartItem.id, cartItem.product.id, cartItem.qty - 1);
															}}
															type="button"
															className="btn btn-outline-dark btn-sm" disabled={cartItem.qty === 1}
														>
															-
														</button>
														<span
															className="btn border border-dark"
															style={{ width: "50px", cursor: "auto" }}
														>{cartItem.qty}</span>
														<button
															onClick={() => {
																updateCartItem(cartItem.id, cartItem.product.id, cartItem.qty + 1);
															}}
															type="button"
															className="btn btn-outline-dark btn-sm"
														>
															+
														</button>
													</div>
													<span className="input-group-text bg-transparent border-0">
														{cartItem.product.unit}
													</span>
												</div>
											</td>
											<td className="text-end">{cartItem.total}</td>
										</tr>
									);
								})}
							</tbody>
							<tfoot>
								<tr>
									<td colSpan="3" className="text-end">
										總計：
									</td>
									<td className="text-end" style={{ width: "130px" }}>{cart.final_total}</td>
								</tr>
							</tfoot>
						</table>
					</div>
				)}
				<h3 className="mb-4">填寫訂單資料</h3>
				<div className="row justify-content-center">
					<form
						onSubmit={onSubmit}
						className="col-md-6"
					>
						<div className="mb-3">
							<label htmlFor="email" className="form-label">Email</label>
							<input
								{...register("email", {
									required: "Email欄位必填",
									pattern: {
										value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
										message: "Email格式不正確",
									}
								})}
								id="email"
								type="email"
								className={`form-control ${errors.email ? "is-invalid" : ""}`}
								placeholder="請輸入Email"
							/>
							{errors.email && <p className="text-danger my-2">{errors.email.message}</p>}
						</div>
						<div className="mb-3">
							<label htmlFor="name" className="form-label">收件人姓名</label>
							<input
								{...register("name", {
									required: "姓名欄位必填",
								})}
								id="name"
								type="text"
								className={`form-control ${errors.name ? "is-invalid" : ""}`}
								placeholder="請輸入姓名"
							/>
							{errors.name && <p className="text-danger my-2">{errors.name.message}</p>}
						</div>
						<div className="mb-3">
							<label htmlFor="tel" className="form-label">收件人電話</label>
							<input
								{...register("tel", {
									required: "電話欄位必填",
									pattern: {
										value: /^(0[2-8]\d{7}|09\d{8})$/,
										message: "電話格式不正確",
									}
								})}
								id="tel"
								type="text"
								className={`form-control ${errors.tel ? "is-invalid" : ""}`}
								placeholder="請輸入電話"
							/>
							{errors.tel && <p className="text-danger my-2">{errors.tel.message}</p>}
						</div>
						<div className="mb-3">
							<label htmlFor="address" className="form-label">收件人地址</label>
							<input
								{...register("address", {
									required: "地址欄位必填",
								})}
								id="address"
								type="text"
								className={`form-control ${errors.address ? "is-invalid" : ""}`}
								placeholder="請輸入地址"
							/>
							{errors.address && <p className="text-danger my-2">{errors.address.message}</p>}
						</div>
						<div className="mb-3">
							<label htmlFor="message" className="form-label">留言</label>
							<textarea
								{...register("message")}
								id="message"
								className="form-control"
								cols="30"
								rows="10">
							</textarea>
						</div>
						<button type="submit" className="btn btn-primary">送出訂單</button>
					</form>
				</div>
				{isScreenLoading && (
					<div
						className="d-flex justify-content-center align-items-center"
						style={{
							position: "fixed",
							inset: 0,
							backgroundColor: "rgba(255,255,255,0.3)",
							zIndex: 999,
						}}
					>
						<ReactLoading type="spin" color="black" width="4rem" height="4rem" />
					</div>
				)}

			</div>
		</>
	);
}

export default App;
