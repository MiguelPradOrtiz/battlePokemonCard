import React, { useEffect, useState } from 'react';
import '../styles/card.css';

const Card = () => {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=400`;
    const [data, setData] = useState([]);
    const [hand1, setHand1] = useState([]);
    const [hand2, setHand2] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [selectedPokemon2, setSelectedPokemon2] = useState(null);
    const [battleResult, setBattleResult] = useState(null);

    const getRandomPokemon = (pokemonArray, count) => {
        const shuffled = pokemonArray.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const handleClick = (pokemon, putPokemon, lessHand, holdHand) => {
        putPokemon(pokemon);
        holdHand(lessHand.filter(p => p !== pokemon));
    };

    const backToHand = (selectedPokemon, hand, holdPokemon) => {
        hand.push(selectedPokemon);
        holdPokemon(null);
    }

    const handleFight = () => {
        if (selectedPokemon && selectedPokemon2) {
            // Calcula el daño
            const attack1 = selectedPokemon.stats.find(stat => stat.stat.name === 'attack').base_stat;
            const defense2 = selectedPokemon2.stats.find(stat => stat.stat.name === 'defense').base_stat;

            const attack2 = selectedPokemon2.stats.find(stat => stat.stat.name === 'attack').base_stat;
            const defense1 = selectedPokemon.stats.find(stat => stat.stat.name === 'defense').base_stat;

            // Aplica el daño reduciendo la defensa
            let newDefense1 = defense1 - attack2;
            let newDefense2 = defense2 - attack1;

            if (newDefense2 <= 0 && newDefense1 <= 0){
                setBattleResult('Ambos pokemon han sido destruidos');

                if(hand1.length === 0 && hand2.length === 0){
                    setBattleResult('Empate');
                }
            }
            
            // Verifica si algún Pokémon tiene defensa menor o igual a 0
            if (newDefense1 <= 0) {
                setSelectedPokemon(null);
                setHand1(hand1.filter(p => p !== selectedPokemon));
                setBattleResult(`${selectedPokemon.name} ha sido destruido.`);
                console.log(hand1.length);
                if(hand1.length === 0){
                    setBattleResult('Gana el equipo Rojo!');
                
                }
            } else {
                setSelectedPokemon({
                    ...selectedPokemon,
                    stats: selectedPokemon.stats.map(stat =>
                        stat.stat.name === 'defense' ? { ...stat, base_stat: newDefense1 } : stat
                    )
                });
            }

            if (newDefense2 <= 0) {
                setSelectedPokemon2(null);
                setHand2(hand2.filter(p => p !== selectedPokemon2));
                setBattleResult(`${selectedPokemon2.name} ha sido destruido.`);
                console.log(hand1.length);
                if(hand2.length === 0){
                    setBattleResult('Gana el equipo Verde!');
                
                }
            } else {
                setSelectedPokemon2({
                    ...selectedPokemon2,
                    stats: selectedPokemon2.stats.map(stat =>
                        stat.stat.name === 'defense' ? { ...stat, base_stat: newDefense2 } : stat
                    )
                });
            }


        }
    };

    useEffect(() => {
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                const pokemonUrls = data.results.map(pokemon => pokemon.url);
                return Promise.all(pokemonUrls.map(url => fetch(url).then(res => res.json())));
            })
            .then((pokemonDetails) => {
                setData(pokemonDetails);
                const randomHand1 = getRandomPokemon(pokemonDetails, 6);
                const randomHand2 = getRandomPokemon(pokemonDetails.filter(p => !randomHand1.includes(p)), 6);
                setHand1(randomHand1);
                setHand2(randomHand2);
            })
            .catch((error) => {
                console.log("Error al conectar con la API ", error);
            });
    }, []);

    return (
        <div className="field">
            <div className="handDeck up">
                <div className="card-hand-pokemon up">
                    {hand1.map((pokemon, index) => (
                        <div
                            className={`info-pokemon arriba ${selectedPokemon === pokemon ? 'selected' : ''}`}
                            onClick={() => handleClick(pokemon, setSelectedPokemon, hand1, setHand1)}
                            key={index}
                        >
                            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                            <span>{pokemon.name}</span>
                            <div>Ataque: {pokemon.stats.find(stat => stat.stat.name === 'attack').base_stat}</div>
                            <div>Defensa: {pokemon.stats.find(stat => stat.stat.name === 'defense').base_stat}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="handDeck bottom">
                <div className="card-hand-pokemon bottom">
                    {hand2.map((pokemon, index) => (
                        <div
                            className={`info-pokemon abajo ${selectedPokemon2 === pokemon ? 'selected' : ''}`}
                            onClick={() => handleClick(pokemon, setSelectedPokemon2, hand2, setHand2)}
                            key={index}
                        >
                            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                            <span>{pokemon.name}</span>
                            <div>Ataque: {pokemon.stats.find(stat => stat.stat.name === 'attack').base_stat}</div>
                            <div>Defensa: {pokemon.stats.find(stat => stat.stat.name === 'defense').base_stat}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="battle-actions">
                <button className='btn-fight' onClick={handleFight}>Pelear</button>
                {battleResult && <div className="battle-result">{battleResult}</div>}
            </div>
            <div className="battle-selected">
                {selectedPokemon && (
                    <div className="selected-card up" onClick={() => backToHand(selectedPokemon, hand1, setSelectedPokemon)}>
                        <img src={selectedPokemon.sprites.front_default} alt={selectedPokemon.name} />
                        <span>{selectedPokemon.name}</span>
                        <div>Ataque: {selectedPokemon.stats.find(stat => stat.stat.name === 'attack').base_stat}</div>
                        <div>Defensa: {selectedPokemon.stats.find(stat => stat.stat.name === 'defense').base_stat}</div>
                    </div>
                )}
                {selectedPokemon2 && (
                    <div className="selected-card bottom" onClick={() => backToHand(selectedPokemon2, hand2, setSelectedPokemon2)}>
                        <img src={selectedPokemon2.sprites.front_default} alt={selectedPokemon2.name} />
                        <span>{selectedPokemon2.name}</span>
                        <div>Ataque: {selectedPokemon2.stats.find(stat => stat.stat.name === 'attack').base_stat}</div>
                        <div>Defensa: {selectedPokemon2.stats.find(stat => stat.stat.name === 'defense').base_stat}</div>
                    </div>
                )}
            </div>

        </div>
    );
}

export default Card;
