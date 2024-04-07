import React, { useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessages from "../../hooks/useSendMessages";

const MessageInput = () => {
  const { loading, sendMessage } = useSendMessages();
  const [message, setMessage] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [showAdditionalContent, setShowAdditionalContent] = useState(false);

  // Example tags
  const exampleTags = ["@everyone", "@here", "#general", "#random"];

  // Radio options
  const radioOptions = ["Option 1", "Option 2", "Option 3"];
  
  const handleTagInput = (e) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = () => {
    if (tagInput.trim() === "") return;
    setTags([...tags, tagInput.trim()]);
    setTagInput("");
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    setTagInput(tag);
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const m = {
      text: message,
      tags: tags,
      radioOption: selectedOption,
    };
    if (!m.text) return;
    await sendMessage(m);
    setMessage("");
    setTags([]);
    setSelectedTag("");
    setSelectedOption("");
  };

  return (
    <div className="p-2 bg-gray-800 rounded-lg">
      <form onSubmit={handleSubmit}>
        {/* Message Input */}
        <div className="mb-2">
          <label className="form-control">
            {/* <div className="label">
              <span className="label-text">Type Your Text Here..</span>
            </div> */}
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Type Your Text Here.."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
        </div>

        {/* Collapsible Content */}
        <div className="collapse bg-base-200">
          <input type="checkbox" id="toggleContent" className="toggle" />
          <label htmlFor="toggleContent" className="collapse-title text-xl font-medium cursor-pointer">
          <kbd className="kbd">Click Hre To Show/Hide More Options</kbd>
          </label>
          <div className="collapse-content"> 
            <div className="mb-2 px-5" style={{ display: "flex", flexDirection: "row" }}>
              {radioOptions.map((option, index) => (
                <label key={index} className="form-control mr-2 cursor-pointer">
                  <input
                    type="radio"
                    name="radio-options"
                    className="radio mr-1"
                    value={option}
                    checked={selectedOption === option}
                    onChange={handleOptionChange}
                  />
                  <span className="label-text">{option}</span>
                </label>
              ))}
            </div>

            {/* Tags */}
            <div className="mb-2">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Tags</span>
                </div>
                <select
                  className="select select-bordered w-full"
                  value={selectedTag}
                  onChange={(e) => handleTagSelect(e.target.value)}
                >
                  <option value="">Select Tag...</option>
                  {exampleTags.map((tag, index) => (
                    <option key={index} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" onClick={handleAddTag} className="btn btn-sm btn-outline btn-primary ml-2">
                Add Tag
              </button>
              <div className="flex flex-wrap mt-1">
                {tags.map((tag, index) => (
                  <div key={index} className="badge badge-info gap-2 mr-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(index)} className="ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.061 5.635a.5.5 0 0 0-.707 0l-1.414 1.414a.5.5 0 1 0 .707.707l1.414-1.414a.5.5 0 0 0 0-.707zM10 3a1 1 0 0 0-1 1v1H5a1 1 0 0 0 0 2h1v1a1 1 0 0 0 2 0V7h1a1 1 0 0 0 0-2H8V4a1 1 0 0 0-1-1z"/>
                        <path fillRule="evenodd" d="M5 17a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5zm10-1H5a1 1 0 0 1-1-1V8h12v7a1 1 0 0 1-1 1z"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Send Button */}
        <button className="bg-blue-500 text-white px-3 py-2 rounded-lg">
          {loading ? <div className="loading loading-ring loading-md"></div> : <BsSend />}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
