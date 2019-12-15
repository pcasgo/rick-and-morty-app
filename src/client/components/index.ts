import React, { Component } from 'react';

class CharactersComponent extends Component {

    componentDidMount() {
        console.log("Find characters");
        this.loadCharacters();
    }

    loadCharacters = () => {
        fetch('http://localhost:3500').then(resolve => {
            return resolve.json();
        }).then(data => {
            console.log(data);
        });
    }
}