// Récupérer le bouon ajouter et la zone d'affichage des livres et des statistiques
const btn = document.getElementById('btn') /* bouton Ajouter*/
const btn2 = document.getElementById('btn2') /*bouton Valider*/

const listeLivres = document.getElementById('listeLivres')
const total = document.getElementById('total')
const lus = document.getElementById('lus')
const nonLus = document.getElementById('nonLus')

const titre = document.getElementById('titre')
const auteur = document.getElementById('auteur')    
const annee = document.getElementById('annee')
const genre = document.getElementById('genre')
const lu = document.getElementById('lu')


// 1. Tableau de livres
const donnee = localStorage.getItem('mesLivres')

let livres = donnee !== null ? JSON.parse(donnee) :  [
  { id : 1 , titre: 'Bienvenue en 6ème', auteur: 'Stéphane Gando', annee: 2013, genre: 'Roman', lu: false },
  { id : 2 , titre: "Le retour de l'enfant soldat", auteur: 'François d\'assise N\'da', annee: 2008, genre: 'Roman', lu: true },
  { id : 3 , titre: 'Les larmes de Carène', auteur: 'Élodie Yeboua', annee: 2015, genre: 'Roman', lu: true }
]

// Afficher les livres pré-remplis et mettre a jour les stats de depart
afficherLivres(livres)
mettreAJourStats()


// 2. Fonction pour afficher tous les livres
function afficherLivres(tableauLivres) {

    // Effacer l'affichage actuel
    listeLivres.innerHTML = ""

    // Parcourir le tableau livres
    for (let i=0 ; i< tableauLivres.length ; i++){

        // Créer une carte pour chaque livre
        const divLivre = document.createElement('div')
        divLivre.classList.add('livre')

        if(tableauLivres[i].lu === true){
            divLivre.classList.add('lu')
            divLivre.innerHTML = `
                <span>Lu✅</span>
                <h3>${tableauLivres[i].titre}</h3>
                <p class="author">Par ${tableauLivres[i].auteur}</p>
                <p>${tableauLivres[i].annee} | ${tableauLivres[i].genre}</p>
            `
        }else{
            divLivre.innerHTML = `
                <span>Non lu</span>
                <h3>${tableauLivres[i].titre}</h3>
                <p class="author">Par ${tableauLivres[i].auteur}</p>
                <p>${tableauLivres[i].annee} | ${tableauLivres[i].genre}</p>
            `
        }
        
        

        // Ajouter un bouton supprimer et modifier
        const divBtn = document.createElement('div')
        divBtn.classList.add('btn-edit-remove')

        const btnEdit = document.createElement('button')
        btnEdit.classList.add('btn-edit')
        btnEdit.textContent = 'Modifier'

        btnEdit.addEventListener('click',()=>{
            modifierLivre(tableauLivres[i].id)
        })

        const btnRemove = document.createElement('button')
        btnRemove.classList.add('btn-remove')
        btnRemove.textContent = 'Supprimer'

        btnRemove.addEventListener('click' , ()=>{
            supprimerLivre(tableauLivres[i].id)
        })

        divBtn.appendChild(btnEdit)
        divBtn.appendChild(btnRemove)

        divLivre.appendChild(divBtn)

        listeLivres.appendChild(divLivre)
    }
}


// 3. Fonction pour ajouter un livre
function ajouterLivre(titre, auteur, annee, genre, lu) {

    // Créer un objet livre
    const newLivre = {id:Date.now() ,titre : titre , auteur : auteur , annee : annee , genre : genre , lu : lu}

    // L'ajouter au tableau
    livres.unshift(newLivre) 

    // Mettre à jour l'affichage et les stats et sauvegarder
    afficherLivres(livres)
    mettreAJourStats()
    sauvegarder()
 
}


// Fonction pour modifier un livre
let idEnCours = null; 

function modifierLivre(id){
    const indexLivre = livres.findIndex(book => book.id === id )
    idEnCours = id

    btn.style.display = 'none'
    btn2.style.display = 'block'

    titre.value = livres[indexLivre].titre
    auteur.value = livres[indexLivre].auteur
    annee.value = livres[indexLivre].annee
    genre.value = livres[indexLivre].genre

    titre.focus()

}


// 4. Fonction pour supprimer un livre
function supprimerLivre(id) {

    // Message de confirmation avant de supprimer
    const confirmation = confirm('Ce livre sera supprimer definitivement !')
    if(!confirmation) return

    // Retirer du tableau
    const indexLivre = livres.findIndex((book) => book.id === id )
    livres.splice(indexLivre , 1)

    if(idEnCours === id){
        btn2.style.display = 'none'
        btn.style.display = 'block'
        idEnCours = null
        viderChamps()
    }

    // Mettre à jour l'affichage et les stats et sauvegarder
    afficherLivres(livres)
    mettreAJourStats()  
    sauvegarder()
}



// 5. Fonction pour mettre à jour les statistiques
function mettreAJourStats() {

    // Calculer le total
    total.textContent = livres.length

    // Calculer les livres lus et non lus
    let livreLus = 0
    let livreNonLus = 0

    for (let livre of livres){

        if(livre.lu === true){
            livreLus++
        }else{
            livreNonLus++
        }
    }

    // Afficher les résultats
    lus.textContent = livreLus
    nonLus.textContent = livreNonLus
}




//  6.Ecouteur d'évènement

// Formulaire d'ajout
btn.addEventListener('click' , (e)=>{

    e.preventDefault()

    // Ajouter le livres si les champs sont remplis
    if(titre.value === '' || auteur.value === '' || annee.value === '' || genre.value === ''){
        alert('⛔ Remplissez tous les champs svp')
    }else{
        if(lu.checked){
            ajouterLivre(titre.value , auteur.value , Number(annee.value) , genre.value , true)
        }else{
            ajouterLivre(titre.value , auteur.value , Number(annee.value) , genre.value , false)
        }

        // Message d'ajout du livre
        setTimeout(() => {
            alert('✅ Livre ajouté ')
        }, 10);

        viderChamps()
    }

})

// valider la modification d'un livre un livre
btn2.addEventListener('click' , (e)=>{
    e.preventDefault()
    const indexLivre = livres.findIndex(book => book.id === idEnCours)

    /**
     * @type {object}
     */
    let livreEdit
    if (lu.checked){
        livreEdit = {
            id:idEnCours ,
            titre : titre.value , 
            auteur : auteur.value , 
            annee : Number(annee.value) , 
            genre : genre.value , 
            lu : true
        }
    }else{
        livreEdit = {
            id:idEnCours ,
            titre : titre.value , 
            auteur : auteur.value , 
            annee : Number(annee.value) , 
            genre : genre.value , 
            lu : false
        }
    }
    
    livres.splice(indexLivre,1,livreEdit)

    afficherLivres(livres)
    mettreAJourStats()
    sauvegarder()
    viderChamps()

    btn.style.display = 'block'
    btn2.style.display = 'none'
    idEnCours = null;
})


// Vider la bibliothèque
const vider = document.getElementById('clear')

vider.addEventListener('click' , ()=>{
    // Question de confirmation
    const confirmation = confirm('Voulez-vous vider la bibliothèque ?')
    if (!confirmation) return

    livres.splice(0 , livres.length)

    afficherLivres(livres)
    mettreAJourStats()
    sauvegarder()
})

// Vider les champs
function viderChamps(){
    titre.value = '' 
    auteur.value = ''
    annee.value = ''
    genre.value = ''
}



// Champ de recherche
const recherche = document.getElementById('recherche')

recherche.addEventListener('input' , (e)=>{
    const rechercheLivre = e.target.value
    const livresFiltre = livres.filter(book => book.titre.toLowerCase().includes(rechercheLivre.toLowerCase()) )
    
    afficherLivres(livresFiltre)

    if(livresFiltre.length === 0) listeLivres.innerHTML = '<p class="aucun-resultat">Aucun résutat</p>'

})



// LocalStorage (Fonction pour sauvegarder)
function sauvegarder(){
    localStorage.setItem('mesLivres' , JSON.stringify(livres))
}
