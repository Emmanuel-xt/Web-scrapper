"use client";

import { scrapeAndStoreProduct } from "@/lib/actions";
import React, { FormEvent, useState } from "react";

const Searchbar = () => {
  const [searchPromt, setSearchPromt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidAmazonProductURL = (url: string) => {
    try {
      const parsedURL = new URL(url);
      const hostname = parsedURL.hostname;

      if (
        hostname.includes("amazon.com") ||
        hostname.includes("amazon.") ||
        hostname.includes("amazon")
      ) {
        return true;
      }
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async  (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmazonProductURL(searchPromt);

    if (!isValidLink) return alert("PLease Provide a Valid Amazon Link");

    alert(isValidLink ? "Valid link" : "Invalid Link");

    try {
      setIsLoading(true);
      const product = await scrapeAndStoreProduct(searchPromt)
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      action=""
      className="flex flex-wrap gap-4 mt-12"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        value={searchPromt}
        onChange={(e) => setSearchPromt(e.target.value)}
        placeholder="Enter Product Link"
        className="searchbar-input"
      />
      <button
        type="submit"
        className="searchbar-btn"
        disabled={searchPromt === ""}
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default Searchbar;
