import React from "react";

const SearchInput = () => {
  return(
  <form>
    <input
      type="text"
      placeholder="search ..."
      className="input input-bordered rounded-full"
    />
    <button type="submit" className="btn btn-circle bg-sky-500 text-white">
    🔍
    </button>
  </form>)
}

export default SearchInput;
