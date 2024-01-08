'use server'

import Product from "@/models/product.model"
import { connectToDB } from "../database"
import { scrapeAmazonProduct } from "../scraper"
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils"
import { revalidatePath } from "next/cache"
import { generateEmailBody, sendEmail } from "../nodemailer"
import { User } from "@/types"

export async function scrapeAndStoreProduct(productUrl: string) {
    if (!productUrl) return
    try {
        connectToDB()

        const scrapedProduct = await scrapeAmazonProduct(productUrl)

        if (!scrapedProduct) return

        let product = scrapedProduct

        const existingProduct = await Product.findOne({ url: scrapedProduct.url })

        if (existingProduct) {
            const updatedPriceHistory: any = [
                ...existingProduct.priceHistory,
                { price: scrapedProduct.currentPrice }
            ]

            product = {
                ...scrapedProduct,
                priceHistory: updatedPriceHistory,
                lowestPrice: getLowestPrice(updatedPriceHistory),
                heighestPrice: getHighestPrice(updatedPriceHistory),
                averagePrice: getAveragePrice(updatedPriceHistory)
            }
        }

        const newProduct = await Product.findOneAndUpdate(
            { url: scrapedProduct.url },
            product,
            { upsert: true, new: true }

        );

        revalidatePath(`/products/${newProduct._id}`)


        console.log('Product created || updated succefully')
    } catch (error: any) {
        throw new Error(`failed to Create or Update product: ${error.message}`)
        // console.log(error)
    }
}

export  async function getProductById(productId: string) {
    try {
        connectToDB()

        const product = Product.findOne({_id: productId})

        if (!product) return null

        return product
    } catch (error) {
        console.log('error getting product' , error)
    }
}

export async function getAllProduct() {
    try {
        connectToDB()

        const products = await Product.find()

        if(!products) return null
        return products
    } catch (error) {
        console.log(error)
    }
}

export async function getSimilarProduct(productId : string) {
    try {
        connectToDB()

        const currentProduct = await Product.findById(productId)

        if(!currentProduct) return null

        const similarProduct = await Product.find({
            _id : {$ne : productId}
        })
        return similarProduct
    } catch (error) {
        console.log(error)
    }
}



export async function addUserEmailToProduct(productId: string, userEmail: string) {
    try {
      const product = await Product.findById(productId);
  
      if(!product) return;
  
      const userExists = product.users.some((user: User) => user.email === userEmail);
  
      if(!userExists) {
        product.users.push({ email: userEmail });
  
        await product.save();
  
        const emailContent = await generateEmailBody(product, "WELCOME");
  
        await sendEmail(emailContent, [userEmail]);
      }
    } catch (error) {
      console.log(error);
    }
}