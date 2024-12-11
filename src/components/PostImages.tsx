import { Carousel } from "antd";
import React from "react";

interface Image {
  id: number;
  objectPath: string;
}

interface PostImagesProps {
  images?: Image[] | null;
}

const PostImages: React.FC<PostImagesProps> = ({ images }) => {
  if (!images || images.length === 0) return null; // Handle no images case
  const baseURL = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div
      style={{
        margin: "15px",
      }}
    >
      {images.length > 1 ? (
        <Carousel arrows infinite={false}>
          {images.map((image) => (
            <div key={image.id} style={{ textAlign: "center" }}>
              <img
                src={`http://localhost:3001/${image.objectPath}`}
                alt="Post Image"
                onError={(e) =>
                  console.error(
                    "Failed to load image:",
                    `http://localhost:3001/${image.objectPath}`,
                    e
                  )
                }
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  margin: "0 auto",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>
          ))}
        </Carousel>
      ) : (
        <img
          src={`http://localhost:3001/${images[0].objectPath}`}
          alt="Post Image"
          onError={(e) =>
            console.error(
              "Failed to load image:",
              `http://localhost:3001/${images[0].objectPath}`,
              e
            )
          }
          style={{
            display: "block", // Ensures image is treated as a block element
            margin: "0 auto", // Centers the image horizontally
            maxWidth: "100%",
            maxHeight: "300px",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        />
      )}
    </div>
  );
};

export default PostImages;
