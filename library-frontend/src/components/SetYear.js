import { useMutation } from "@apollo/client";
import { useState } from "react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";
import Notify from "./Notify";
import Select from "react-select";

const SetYear = ({ authors }) => {

    const [born, setBorn] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);

    const [mutate] = useMutation(EDIT_AUTHOR, {
        refetchQueries: [{ query: ALL_AUTHORS }],
        onError: err => {
            const errors = err.graphQLErrors[0].extensions.error.errors
            const messages = Object.values(errors).map(e => e.message).join('\n')
            setErrorMessage(messages);
        }
    });


    const handleSubmit = async (event) => {
        event.preventDefault();
        await mutate({
            variables: {
                name: selectedOption.value,
                setBornTo: Number(born),
            }
        });
        setSelectedOption(null);
        setBorn("");
    }

    const options = authors.map(a => {
        return { value: a.name, label: a.name }
    })

    return (
        <div>
            <h3>Set birthyear</h3>
            <Notify errorMessage={errorMessage} />

            <form onSubmit={handleSubmit}>
                <div>
                    Author name
                    <Select defaultValue={selectedOption} onChange={setSelectedOption} options={options} />
                </div>
                <div>
                    Set birth year
                    <input value={born} onChange={({ target }) => setBorn(target.value)} />
                </div>
                <button type="submit">Update author</button>
            </form>
        </div>
    )
}

export default SetYear;