import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLocalCart, setLocalCart } from '../utils/cartLocalStorageCopy'
import { findItem } from '../store/products/products'
import SingleCartItemBtn from '../components/CartDetails/SingleCartItemBtn'

const Detail = () => {
  const id = window.location.pathname.split('/')[2]

  const [quantity, setQuantity] = useState(1)
  const [selectedVariation, setSelectedVariation] = useState(null)

  const dispatch = useDispatch()
  const product = useSelector(store => store.products.singleProduct)

  // Set default variation on product load
  useEffect(() => {
    if (product && Object.keys(product.inventory).length > 0) {
      const defaultVariation = Object.keys(product.inventory)[0]
      setSelectedVariation(defaultVariation)
    }
  }, [product])

  // Fetch product details
  useEffect(() => {
    if (id) {
      dispatch(findItem({ id }))
    }
  }, [id, dispatch])

  const handleVariationSelect = variation => {
    setSelectedVariation(variation)
    setQuantity(1)
  }

  const handleQuantityChange = delta => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + delta))
  }

  const addProductToCart = () => {
    if (!selectedVariation || !product) return

    const variationKey = selectedVariation // Ensure this is a valid string key
    const item = {
      id: product.documentId,
      variation: {
        [variationKey]: { quantity } // Ensure this is structured as an object
      }
    }

    setLocalCart(item, variationKey) // Ensure setLocalCart can handle this structure
  }

  return (
    <div className='product-detail flex flex-col md:flex-row md:p-[30px] justify-center items-center text-center text-[#636665] text-black gap-4 py-1 font-bold'>
      {product ? (
        <>
          <img
            src={product.imgUrl}
            alt={product.title}
            className='max-w-[300px] md:max-w-[500px] my-[20px]'
          />
          <div className='flex flex-col items-center gap-1 md:max-w-[500px]'>
            <h1 className='text-3xl font-bold'>{product.title}</h1>
            <div className='flex flex-col items-center p-4 border m-[20px]'>
              <h3 className='text-xl mb-4 p-1 underline underline-offset-2'>
                Brief
              </h3>
              <p className='font-medium text-md text-justify'>
                {product.description}
              </p>
            </div>
            {product?.inventory[selectedVariation]?.oldPrice && (
              <div className='flex gap-2'>
                <span className='text-red-600 line-through'>
                  {product.inventory[selectedVariation].oldPrice} Rs
                </span>
                <span className='text-yellow-500 font-bold'>
                  Price: {product.inventory[selectedVariation].newPrice} Rs
                </span>
              </div>
            )}
            <div className='flex gap-1'>
              {Object.keys(product.inventory).map(variation => (
                <button
                  key={variation}
                  onClick={() => handleVariationSelect(variation)}
                  className={`border border-black ${
                    selectedVariation === variation
                      ? 'bg-black text-white'
                      : 'bg-white text-black'
                  } hover:bg-black hover:text-white w-[80px] transition-all rounded`}
                >
                  {variation}
                </button>
              ))}
            </div>
            <div className='flex items-center gap-2'>
              <SingleCartItemBtn
                text='-'
                handleItemCounter={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              />
              <p>{quantity}</p>
              <SingleCartItemBtn
                text='+'
                handleItemCounter={() => handleQuantityChange(1)}
                disabled={quantity >= 30}
              />
            </div>
            <button
              className={`bg-black text-white p-1 w-[80%] my-4`}
              onClick={addProductToCart}
            >
              Add to Cart
            </button>
          </div>
        </>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  )
}

export default Detail
