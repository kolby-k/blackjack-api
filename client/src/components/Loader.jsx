import React from "react";

function Loader() {
  return (
    <div className="absolute w-[100vw] h-[100vh] flex justify-center items-center">
      <h2 className="text-3xl font-semibold text-purple-500">Loading...</h2>
    </div>
  );
}

export default Loader;
