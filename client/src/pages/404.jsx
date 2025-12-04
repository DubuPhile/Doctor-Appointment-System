import { Link } from "react-router-dom"
import '../styles/404.css';

const Missing = () => {
    return (
        <div className="Missing">
            <article className="Page404" style={{ padding: "100px" }}>
                <h1>Oops!</h1>
                <p>Page Not Found</p>
                <div className="flexGrow">
                    <Link to="/">Visit Our Homepage</Link>
                </div>
            </article>
        </div>
    )
}

export default Missing