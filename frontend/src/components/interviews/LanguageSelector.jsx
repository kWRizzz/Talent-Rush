import React from 'react'
import{
    useDispatch,
    useSelector
} from "react-redux"
import { setLanguage } from '../../redux/slices/editorSlice';


const LanguageSelector = () => {

    const {language}= useSelector(
        (state)=>state.editor
    )

    const dispatch=useDispatch();

    const handleLanguage=(e) => {
        dispatch(
            setLanguage(e.target.value)
        );
    }

  return (
    <div>
        <select 
            value={language}
            onChange={handleLanguage}
             className="border rounded px-3 py-2"
        >
            <option value="javascript">
                JavaScript
            </option>

            <option value="python">
                Python
            </option>

            <option value="java">
                Java
            </option>

            <option value="cpp">
                C++
            </option>
        </select>
    </div>
  )
}

export default LanguageSelector