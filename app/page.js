"use client"
import { StoreProvider } from '@/redux/StoreProvider';
import Image from 'next/image'
import React,{useState,useEffect} from 'react'
import axios from 'axios';

export default function Home() {

  const [cart, setCart] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://backend-shopping-cart.onrender.com/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };

  useEffect(() => {
    // Fetch products from the API
    fetchProducts().then((data) => {
      setProducts(data); // Assuming that the API returns an object with a 'shoes' property containing the product data
    });
  }, []);

  useEffect(() => {
    // Tính tổng giá trị đơn hàng và cập nhật state
    let newTotalPrice = 0;
      for (const product of cart) {
        const productTotal = product.price * product.quantity;
        newTotalPrice += productTotal;
      }
    setTotalPrice(newTotalPrice.toFixed(2));
  }, [cart]); // Sẽ chạy lại khi giỏ hàng (cart) thay đổi


  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) {
      setCart(savedCart.cart);
      setTotalItems(savedCart.totalItems);
    }
  }, []);

  // Lưu trạng thái giỏ hàng vào localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify({ cart, totalItems }));
  }, [cart, totalItems]);


  const addToCart = (product) => {
    // Tạo một bản sao mới của danh sách sản phẩm trong giỏ hàng
    const newCart = [...cart];

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingProductIndex = newCart.findIndex((item) => item.id === product.id);

    if (existingProductIndex !== -1) {
      // Nếu sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng sản phẩm đó lên
      newCart[existingProductIndex].quantity += 1;
    } else {
      // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm sản phẩm vào giỏ hàng
      newCart.push({ ...product, quantity: 1 });
    }

    // Cập nhật state giỏ hàng và tổng số lượng sản phẩm
    setCart(newCart);
    setTotalItems(totalItems + 1);
  };

  const removeFromCart = (product) => {
    // Tạo một bản sao mới của danh sách sản phẩm trong giỏ hàng
    const newCart = [...cart];
  
    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingProductIndex = newCart.findIndex((item) => item.id === product.id);
  
    if (existingProductIndex !== -1) {
      // Giảm số lượng sản phẩm đó đi 1
      if (newCart[existingProductIndex].quantity > 1) {
        newCart[existingProductIndex].quantity -= 1;
      } else {
        // Nếu số lượng là 1, xoá sản phẩm khỏi giỏ hàng
        newCart.splice(existingProductIndex, 1);
      }
  
      // Cập nhật state giỏ hàng và tổng số lượng sản phẩm
      setCart(newCart);
      setTotalItems(totalItems - 1);
    }
  };
   
  const deleteFromCart = (product) => {
    // Tạo một bản sao mới của danh sách sản phẩm trong giỏ hàng
    const newCart = [...cart];
  
    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingProductIndex = newCart.findIndex((item) => item.id === product.id);
  
    if (existingProductIndex !== -1) {
      // Xóa sản phẩm khỏi giỏ hàng
      newCart.splice(existingProductIndex, 1);
  
      // Cập nhật state giỏ hàng và tổng số lượng sản phẩm
      setCart(newCart);
      setTotalItems(totalItems - product.quantity);
    }
  };
   
  

  
  
  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-32 bg-gradient-to-r from-purple-500 to-pink-500" >
      <div className='wrapper grid grid-cols-2 gap-20 max-w-3xl'>
          <div className='productwrapper  rounded-3xl h-[32rem] bg-gray-300 drop-shadow-2xl'>
            <div className='mx-10 sticky top-0 '>
              <img src='./nike.png' className='w-24  ' ></img>
              <h1 className='text-3xl font-bold h-1/5 mb-3'>Our Products  </h1>
            </div>
            <div className='listProducts mx-10 h-4/5 overflow-scroll no-scrollbar'>
            {
              products?.map((product)=>(
                <div key={product.id} className='mb-20' >
                    <img src={product.image} alt='img' style={{backgroundColor: product.color}} className='rounded-3xl mb-4' />
                    <h4 className='font-bold text-xl mb-4'>{product.name}</h4>
                    <h5 className='font-normal text-base mb-5'>{product.description}</h5>
                    <div className='flex flex-row justify-between'>
                      <h4 className='font-bold text-xl'>${product.price}</h4>
                      {cart.some((item) => item.id === product.id) ? (
                        <button className="bg-yellow-500  font-bold py-2 px-4 rounded-full text-black font-bold py-2 px-4  inline-flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          className='bg-yellow-500 hover:bg-yellow-700 text-black font-bold py-2 px-4 rounded-full'
                          onClick={() => addToCart(product)}
                        >
                          ADD TO CART
                        </button>
                      )}
                    </div>
                </div>
              ))
            }
            </div>
            
          </div>
          <div className='cartWrapper  rounded-3xl h-[32rem] bg-gray-300 drop-shadow-2xl '>
          <div className='mx-5 sticky top-0 '>
              <img src='./nike.png' className='w-24  ' ></img>
              <div className='flex flex-row justify-between items-center mb-3 '>
                <h1 className='text-3xl font-bold h-1/5 '>Your Carts </h1>
                <h1 className='text-3xl font-bold h-1/5' >${totalPrice}</h1>
              </div>
            </div>
            <div className='listCarts mx-5 h-4/5 overflow-scroll no-scrollbar'>
            {
              totalItems === 0 ? (
                <p className='text-sm'>Your Cart is empty</p>
              ) : null // hoặc có thể thay bằng phần tử JSX khác để xử lý trường hợp ngược lại
            }
              {
                cart.map((product) => {
                  return (
                    <div key={product.id} className='flex flex-grow justify-between'>
                      <div className='w-1/3 '>
                        <img src={product.image} style={{backgroundColor: product.color}} className='rounded-3xl mb-4'></img>
                      </div>
                      <div className='w-2/3 ml-3'>
                        <p className='font-bold'>{product.name}</p>
                        <p className='font-bold '>${product.price}</p>
                        <div className='flex flex-row justify-between'>
                          <div className='flex flex-row justify-between items-center'>
                            
                          <button className="bg-slate-200 hover:bg-slate-300  font-bold py-2 px-4 rounded-full text-black font-bold py-2 px-4  inline-flex items-center"  onClick={() => removeFromCart(product)}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path d="M6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" />
                          </svg>


                          </button>

                          <span className='m-2 justify-items-center'>{product.quantity}</span>

                          <button className="bg-slate-200 hover:bg-slate-300  font-bold py-2 px-4 rounded-full text-black font-bold py-2 px-4  inline-flex items-center" onClick={() => addToCart(product)}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" />
                          </svg>
                          </button>


                          </div>
                          <button class="bg-yellow-500 hover:bg-yellow-700  font-bold py-2 px-4 rounded-full text-black font-bold py-2 px-4  inline-flex items-center" onClick = {() => deleteFromCart(product)}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                          </svg>
                          </button>
                        </div>
                        
                      </div>
                    </div>
                  );
                })
              }
          
            </div>
          </div>
    </div>
      
    </main>
  )
}
