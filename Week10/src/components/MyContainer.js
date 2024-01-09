import MyList from "./MyList";
import { useState } from "react";

const MyContainer = () => {
    const [items, setItems] = useState([
        {id: 1, text: "This is an item"},
        {id: 2, text: "Also this"},
    ]);

    const addItem = (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const text = formData.get("text");
        const newItems = [...items, {id: items.length + 1, text: text}];
        setItems(newItems);
    }

    return (
        <div>
        <form onSubmit={addItem}>
            <textarea name="text" rows={4} cols={30}/>
            <button type="submit">Add item</button>
        </form>
        <MyList 
        header="Really epic list component"
        items= {items} 
        />
        </div>
    );
}

export default MyContainer;