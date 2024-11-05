const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			
			contacts: [

			],

			newContacts: [
				{
					name: "Ronaldo Nazario", 
					email: "elgordoronaldo@gmail.com", 
					phone: "0993521455", 
					address: "Av. Siempre Viva 1234" 
				},
				{
					name: "Nicolás Maduro", 
					email: "sigomadurando@commie.com", 
					phone: "512455258", 
					address: "124 Conch St., Bikini Bottom" 
				}
			]
			
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			loadSomeData: () => {
				/**
					fetch().then().then(data => setStore({ "foo": data.bar }))
				*/
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},
			//función para importar contacto
			getContacts: async () => {
				const store = getStore();
				const actions = getActions();
				const resp = await fetch(process.env.BACKEND_URL+`agendas/juanma`);
				if(resp.status == 404){
					await getActions().createAgenda();
					store.newContacts.forEach(async (item) => {
						await actions.createContact(item)	
					})
					// Se crea la nueva agenda usando el método Actions
					return null
				}
				
					
				const data = await resp.json();
				console.log(data);
				setStore({contacts: data.contacts})
			},
			//Función para crear un contacto.
			createContact: async (newContact) => {
				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");
				const resp = await fetch(process.env.BACKEND_URL+`agendas/juanma/contacts`, {
					method: 'POST',
					headers: myHeaders,
					body: JSON.stringify(newContact),
				});
				if(resp.ok) {
					await getActions().getContacts()
				}
			},
			 createAgenda: async () => {
				try {
					const myHeaders = new Headers();
					myHeaders.append("Content-Type", "application/json");
					const resp = await fetch(process.env.BACKEND_URL+`agendas/juanma`, {
						method: "POST",
						headers: { "Content-Type": "application/json" }
					})
					if (resp.status == 201) {
						await getActions().getContacts()
					}
				} catch (error) {
					console.log(error)
					return false
				}
			},
			 deleteContact: async (contact_id) => {
				const resp = await fetch(process.env.BACKEND_URL+`agendas/juanma/contacts/${contact_id}`, {
					method: "DELETE",
				});
		
				if (resp.ok) {
					await getActions().getContacts()
				} else {
					console.error("Error al eliminar la tarea");
				}
			},
			editContact: async (id, updatedContact) => {
				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");
			
				const resp = await fetch(`${process.env.BACKEND_URL}agendas/juanma/contacts/${id}`, {
					method: "PUT",
					headers: myHeaders,
					body: JSON.stringify(updatedContact),
				});
			
				if (resp.ok) {
					await getActions().getContacts(); // Actualiza la lista de contactos
				} else {
					console.error("Error al editar el contacto");
				}
			},
			clearContact: () => {
				setStore({ contact: { name: "", email: "", phone: "", address: "" } });
			}
		}
	};
};

export default getState;