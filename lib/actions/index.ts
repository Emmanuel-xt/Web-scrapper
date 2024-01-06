'use server'

import { scrapeAmazonProduct } from "../scraper"

export async function scrapeAndStoreProduct(productUrl : string){
    if(!productUrl)return
    try {
        const scrapeProduct = await scrapeAmazonProduct(productUrl)
        
    } catch (error : any) {
        throw new Error(`failed to Create or Update product: ${error.message}`)
    }
}