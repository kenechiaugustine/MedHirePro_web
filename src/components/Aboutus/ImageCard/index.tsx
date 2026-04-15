const ImageCard = ({
  imageSrc = "/about-image.jpg",
  altText = "Digital Healthcare",
  stat = "98.4%",
  label = "Placement Success Rate",
}) => {
  return (
    <div className="relative">
      <div className="rounded-2xl overflow-hidden shadow-xl">
        <img
          src={imageSrc}
          alt={altText}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg px-5 py-3">
        <p className="text-xl font-bold text-blue-600">{stat}</p>
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {label}
        </p>
      </div>
    </div>
  );
};

export default ImageCard;