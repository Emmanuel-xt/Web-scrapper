import axios from "axios"
import * as cheerio from 'cheerio'
import { extractCurrency, extractDescription, extractPrice } from "../utils"

export async function scrapeAmazonProduct(url: string) {
    if (!url) return

    // curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_4aeef5ff-zone-emmajs:c23dn58h15ix -k https://lumtest.com/myip.json

    const username = String(process.env.BRIGHT_DATA_USERNAME)
    const password = String(process.env.BRIGHT_DATA_PASSWORD)
    const port = 22225
    const session_id = (1000000 * Math.random() | 0)
    const options = {
        auth: {
            username: `${username}-session-${session_id}`,
            password
        },
        host: 'brd.superproxy.io',
        port,
        rejectUnauthorized: false
    }

    try {
        const response = await axios.get(url, options)
        // console.log(response.data)
        const $ = cheerio.load(response.data)
        const title = $('#productTitle').text().trim()
        const ratings = $('#acrCustomerReviewText').text().trim()
        // console.log('title : ', title)
        // console.log('ratings : ', ratings)

        const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('a.size.base.a-color-price'),
            $('.a-button-selected a.color-base'),
            $('.a-price.a-text-price')

        );

        const originalPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('#priceblock_dealprice'),
            $('.a-size-base.a-color-price')
          );

        // console.log('currentPrice : ', currentPrice)

        const images =
            $('#imgBlkFront').attr('data-a-dynamic-image')
            || $('#landingImage').attr('data-a-dynamic-image')
            || '{}'

        const imageUrls = Object.keys(JSON.parse(images))
        // console.log('image : ', imageUrls)

        const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';

        const currency = extractCurrency($('.a-price-symbol'))
        // console.log('currency : ', currency)

        const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, '')
        // console.log('discount : ', discountRate)

        const description = extractDescription($)

        const data = {
            url,
            currency: currency || $,
            image: imageUrls[0] ,
            title,
            currentPrice: Number(currentPrice) || Number(originalPrice),
            originalPrice : Number(originalPrice) ||  Number(currentPrice),
            discountRate: Number(discountRate),
            category: 'category',
            priceHistory : [],
            reviewsCount: 100,
            stars: 4.5,
            isOutOfStock: outOfStock,
            description,
            lowestPrice : Number(currentPrice)  ||  Number(originalPrice),
            heighestPrice :  Number(originalPrice)  ||  Number(currentPrice) ,
            averagePrice :  Number(originalPrice)  ||  Number(currentPrice) ,

        }

        // console.log('scrapped data = ' , data)
        return data

    } catch (error: any) {
        throw new Error(`Failed to Scrape Product: ${error.message}`)
    }
}