import { Link } from "react-router-dom"
import '../styles/404.css';

const Unautorized = () => {
  return (
    <div className="Unauto">
            <article className="Unautorized" style={{ padding: "100px" }}>
                <h1>Oops!</h1>
                <p>Unautorized!</p>
                <div className="flexGrow">
                    <Link to="/login">go to login</Link>
                </div>
            </article>
        </div>
  )
}

export default Unautorized