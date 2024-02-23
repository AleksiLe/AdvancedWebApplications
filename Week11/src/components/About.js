import { useState, useEffect } from "react";


function About() {
    const [listItems, setListItems] = useState(null)
    useEffect(() => {
        let mounted = true
        async function doStuff() {
            const response = await fetch("https://jsonplaceholder.typicode.com/posts")
            let data = await response.json()
            if (mounted) {
                setListItems(data.map(item => <li key={item.id}>{item.title}</li>))
            }
        }
        doStuff()

        return () => {
            mounted = false
        }
    }, []) //empty array means only run when the component mounts
    return (
        <div>
            <p>This is the about page</p>
            <ul>
                {listItems}
            </ul>
        </div>
    );
}

export default About;