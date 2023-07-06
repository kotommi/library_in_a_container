import { useMutation } from "@apollo/client";
import { useState } from "react";
import { LOG_IN } from "../queries";
import Notify from "./Notify";

const Login = ({ show, setToken, setPage }) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const [login] = useMutation(LOG_IN);

    if (!show) return null;

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { data } = await login({
                variables: {
                    username,
                    password
                }
            })
            const token = data.login.value;
            localStorage.setItem("library-user-token", token);
            setToken(token);
            setPage("authors")
        } catch (error) {
            setErrorMessage(error.graphQLErrors[0].message)
        }

    }

    return (
        <div>
            <Notify errorMessage={errorMessage} />
            <form onSubmit={handleSubmit}>
                <div>
                    Username
                    <input value={username} onChange={({ target }) => setUsername(target.value)} />
                </div>
                <div>
                    Password
                    <input value={password} onChange={({ target }) => setPassword(target.value)} type={"password"} />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}

export default Login;