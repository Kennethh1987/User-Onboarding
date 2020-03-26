import React, {useState, useEffect} from 'react';
import * as yup from "yup";
import Axios from "axios";


const formScheme = yup.object().shape({
    name: yup.string().required("Name is a required field."),
    email: yup.string().required("Must be a valid email address."),
    terms: yup.boolean().oneOf([true], "please agree to terms of use"),
    password: yup.string()
    .min(8, "Passwords must be atleast 6 characters long.")
    .required("Password is required")
});



export default function Form() {
  
    const [ buttonDisabled, setButtonDisabled] = useState(true);

  const [formState, setFormState] = useState({
    name: "",
    email: "",  
    password: "",
    terms: ""
  
  });
  
  const [errors, setErrors] =useState({
    name: "",
    email: "", 
    password: "",
    terms: ""
   
  });
  
  const [post, setPost] = useState([]);



useEffect(() => {
    formScheme.isValid(formState).then(valid =>{
        setButtonDisabled(!valid);
    });
}, [formState]);


const FormSubmit = e => {
    e.preventDefault();
    console.log("submitted!");
    Axios
        .post("https://reqres.in/api/users", formState)
        .then(res => {
            setPost(res.data);
            console.log("success", res);
            setFormState({
                name: "",
                email: "",
                password: "",
                terms: ""
            });
        })
        .catch(err => console.log(err.response));
};

const validateChange = e  =>{
    yup
    .reach(formScheme, e.target.name)
    .validate(e.target.value)
    .then(valid => {
        setErrors({
            ...errors,
            [e.target.name]: ""
        });
    })
    .catch(err => {
        setErrors({
            ...errors,
            [e.target.name]: err.errors[0]
        });
    });
};



const inputchange = e => {
    e.persist();
    const newFormData = {
        ...formState,
        [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value
    };
    validateChange(e);
    setFormState(newFormData);
};

  return (

      <form onSubmit={FormSubmit}>
      <label htmlFor="name">
        Name: 
        <input
          type="text"
          name="name"
          id="name"
          placeholder="name"
          value={formState.name}
          onChange={inputchange}
        />
        {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
      </label>
      <label htmlFor="email">
        Email: 
        <input
          type="text"
          name="email"
          id="email"
          placeholder="email"
          value={formState.email}
          onChange={inputchange}
        />
     {errors.email.length > 0 ? (
          <p className="error">{errors.email}</p>
        ) : null}
      </label>
      <label htmlFor="password">
        Password: 
        <input 
        type="password"
          name="password"
          id="password"
          placeholder="password"
          value={formState.password}
          onChange={inputchange}
        />
         {errors.password.length > 8 ? (
          <p className="error">{errors.email}</p>
        ) : null}
      </label>
      <label htmlFor="terms" className="terms">
        <input
          type="checkbox"
          name="terms"
          checked={formState.terms}
          onChange={inputchange}
        />
        Terms & Conditions: 
      </label>
      <pre>{JSON.stringify(post, null, 2)}</pre>
      <button disabled={buttonDisabled}>Submit</button>
    </form>
  
  

  );

}