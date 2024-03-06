function MyList(props) {
    const updateStyle = (event) => {
        if (event.target.style.textDecoration === "line-through")
            event.target.style.textDecoration = "none";
        else {
            event.target.style.textDecoration = "line-through";
        }
    }
    const listItems = props.items.map(item => <li key={item.id} onClick={updateStyle}>{item.text}</li>);
    return (
        <div>
            <h1>{props.header}</h1>
            <ol>
                {listItems}
            </ol>
        </div>
    );
}

export default MyList;