// pages/api/pexels.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

interface PexelsResponse {
  photos: {
    id: number;
    src: {
      medium: string;
    };
    alt: string;
  }[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PexelsResponse | { error: string }>
) {
  try {
    const response = await axios.get<PexelsResponse>(
      "https://api.pexels.com/v1/curated?per_page=5",
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY || ""
        }
      }
    );
    res.status(200).json(response.data);
  } catch (error: any) {
    res
      .status(error.response?.status || 500)
      .json({ error: "Failed to fetch data" });
  }
}
