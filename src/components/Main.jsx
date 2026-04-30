import { useEffect, useState } from "react"

const Main = (props) => {
  const { data } = props
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)

  useEffect(() => {
    setShouldLoadVideo(false)
  }, [data?.date, data?.url])

  const getEmbedUrl = (url) => {
    if (!url) return ""

    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }

    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }

    if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1]?.split("?")[0]
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url
    }

    return url
  }

  const getYoutubeThumbnail = (url) => {
    if (!url) return ""

    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0]
      return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : ""
    }

    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0]
      return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : ""
    }

    return ""
  }

  const isVideo = data?.media_type === "video"
  const imageSrc = data?.url || data?.hdurl
  const embedUrl = getEmbedUrl(data?.url)
  const videoUrl = data?.url || ""
  const isEmbeddableVideo = embedUrl.includes("youtube.com/embed/") || embedUrl.includes("player.vimeo.com/video/")
  const isDirectVideoFile = /\.(mp4|webm|ogg)(\?.*)?$/i.test(videoUrl)
  const videoThumbnail = data?.thumbnail_url || getYoutubeThumbnail(data?.url)
  const canRenderVideoInline = isDirectVideoFile || isEmbeddableVideo

  return (
    <div className="imgContainer">
      {isVideo ? (
        canRenderVideoInline ? (
          shouldLoadVideo ? (
            isDirectVideoFile ? (
              <video
                src={videoUrl}
                className="bgImage"
                controls
                playsInline
                preload="metadata"
                autoPlay
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <iframe
                src={embedUrl}
                title={data?.title || "NASA video"}
                className="bgImage"
                frameBorder="0"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )
          ) : (
            <button className="videoPreview" onClick={() => setShouldLoadVideo(true)} type="button" aria-label="Play NASA video">
              {videoThumbnail ? (
                <img
                  src={videoThumbnail}
                  alt={data?.title || "NASA video preview"}
                  className="bgImage"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              ) : (
                <div className="bgImage videoFallbackBg" />
              )}
              <span className="videoPlayButton">Play</span>
            </button>
          )
        ) : (
          data?.thumbnail_url ? (
            <a href={data?.url} target="_blank" rel="noreferrer" className="bgImage">
              <img
                src={data?.thumbnail_url}
                alt={data?.title || "NASA video preview"}
                className="bgImage"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </a>
          ) : (
            <div className="bgImage">
              <p style={{ color: "white", textAlign: "center", padding: "1rem" }}>
                This NASA video cannot be embedded here.
                {" "}
                <a href={data?.url} target="_blank" rel="noreferrer" style={{ color: "#9ad1ff" }}>
                  Open video
                </a>
              </p>
            </div>
          )
        )
      ) : (
        <img
          src={imageSrc}
          alt={data?.title || "NASA image"}
          className="bgImage"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      )}
    </div>
  )
}

export default Main