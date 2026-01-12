import { useState, useEffect } from 'react'; // useEffect import karna mat bhoolna
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false); // Thoda loading effect ke liye

  // Function: Search button dabane par chalega
  const searchRecipe = async () => {
    if(search === "") {
        alert("Please enter a food name!");
        return;
    }
    setLoading(true);
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`);
        const data = await response.json();
        setRecipes(data.meals); 
    } catch (error) {
        console.log("Error:", error);
    }
    setLoading(false);
  };

  // Function: Page load hote hi 9 random recipes layega
  const fetchInitialRecipes = async () => {
    setLoading(true);
    try {
        const randomMeals = [];
        // Hum loop chala kar 9 baar random API call karenge
        for(let i = 0; i < 9; i++) {
            const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
            const data = await response.json();
            randomMeals.push(data.meals[0]); // Har random meal ko array mein daal rahe hain
        }
        setRecipes(randomMeals);
    } catch (error) {
        console.log("Error fetching random meals:", error);
    }
    setLoading(false);
  };

  // useEffect: Ye automatically run karega jab component mount hoga (First Load)
  useEffect(() => {
    fetchInitialRecipes();
  }, []);

  return (
    <div className="container">
      {/* Navbar / Header */}
      <header>
         <h1>Food-O-Holic 🍔</h1>
      </header>
      
      {/* Search Section */}
      <div className="search-box">
        <input 
          type="text" 
          placeholder="Search recipes (e.g. Chicken)..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={searchRecipe}>Search</button>
      </div>

      {/* Loading Text */}
      {loading && <p>Loading delicious food...</p>}

      {/* Results Section */}
      <div className="recipe-grid">
        {recipes && recipes.length > 0 ? (
          recipes.map((item, index) => (
            <div key={index} className="card"> {/* Key index use kiya kyunki random id kabhi same ho sakti hai */}
              <img src={item.strMealThumb} alt={item.strMeal} />
              <h3>{item.strMeal}</h3>
              <p className="category">{item.strCategory}</p> {/* Extra details */}
              <a href={item.strYoutube} target="_blank" rel="noreferrer">Watch Recipe</a>
            </div>
          ))
        ) : (
          !loading && <p>No recipes found. Try searching something else!</p>
        )}
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; 2025 Food-O-Holic. Built with ❤️ by Joy Kharinta.</p>
        <p>Data provided by TheMealDB API</p>
      </footer>
    </div>
  );
}

export default App;