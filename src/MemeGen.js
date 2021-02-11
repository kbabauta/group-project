import React, {Component} from 'react'
import Meme from "./Meme"
import "./styles.css"

class MemeGen extends Component{
    constructor(props){
        super(props)
        this.state = {
            topText: "",
            bottomText: "",
            randomImage: "",
            allMemeImages: [],
            currentMeme: {
                id: "",
                url: "",
            },
            savedMemes: []
        }
        this.saveMeme = this.saveMeme.bind(this)
        this.deleteButton = this.deleteButton.bind(this)
        this.editButton = this.editButton.bind(this)
    }

    randomizeImage = () => {
        let index = Math.floor(Math.random() * (this.state.allMemeImages.length))
        this.setState({
            randomImage: this.state.allMemeImages[index].url,
            currentMeme: this.state.allMemeImages[index]
        })
    }
    componentDidMount(){
        fetch("https://api.imgflip.com/get_memes")
        .then(rawResponse => {
            return rawResponse.json()
        })
        .then(response => {
            const {memes} = response.data
            this.setState({allMemeImages: memes,
            })

            this.randomizeImage()
        })
    }
    handleChange = (e) => {
        const {name, value} = e.target
        this.setState({[name]: value})
    }
    saveMeme(event){
        event.preventDefault()
        let meme = {
            topText: this.state.topText,
            bottomText: this.state.bottomText,
            image: this.state.randomImage,
            id: this.state.currentMeme.id
        }
        this.setState(prevState => {
            return ({
                ...prevState,
                topText: "",
                bottomText: "",
                savedMemes: [...prevState.savedMemes, meme]
            })
        })
        this.randomizeImage()
    }
    deleteButton(memeId){
        let newArray = this.state.savedMemes.filter(meme => memeId !== meme.id)
        this.setState(prevState => ({...prevState, savedMemes: newArray}))
    }
    editButton(passedMeme, stringOne, stringTwo){
        let newArr = this.state.savedMemes.map(meme => {

            if (passedMeme.id === meme.id){
                passedMeme.topText = stringOne
                passedMeme.bottomText = stringTwo
                return passedMeme
            } else {
                return meme
            }
        })
        this.setState(prevState => ({...prevState, savedMemes: newArr}))
    }
    render(){
        const info = {
            topText: this.state.topText,
            bottomText: this.state.bottomText,
            image: this.state.randomImage,
            id: this.state.currentMeme.id
        }
        const memes = this.state.savedMemes.map((eachMeme) => <Meme info={eachMeme}
        deleteButton={this.deleteButton} editButton={this.editButton}/>)

        return(
            <div className="grid-container">
                <form onSubmit={this.saveMeme} className="meme-generator">
                    <input
                    name="topText"
                    placeholder="Top Text"
                    value={this.state.topText}
                    onChange={this.handleChange} 
                    />

                    <input
                    name="bottomText"
                    placeholder="Bottom Text"
                    value={this.state.bottomText}
                    onChange={this.handleChange}
                    />
                    {/* <Meme info={info} hidden={true}/> */}

                    <button className="buttons"
                    onClick={ (e)=>{
                        e.preventDefault()
                        this.randomizeImage()}}
                        >Refresh Meme Image
                        </button>
                        <br></br>
                        <button className="buttons">Save Meme</button>
                </form>
                {memes}
            </div>
        )
    }
}

export default MemeGen