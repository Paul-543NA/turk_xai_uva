// components/AddItem.js
import { useState } from "react";
import db from "../utils/firestore";
import { collection, addDoc } from "firebase/firestore";

const AddItem = () => {
  const [value, setValue] = useState("");

  /**
   * Handles the form submission.
   *
   * @param {Event} event - The form submission event.
   * @returns {Promise<void>} - A promise that resolves when the form submission is handled.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "testCollection"), {
        name: value,
      });
      setValue(""); // Clear the form
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add a new item"
      />
      <button type="submit">Add Item</button>
    </form>
  );
};

export default AddItem;
