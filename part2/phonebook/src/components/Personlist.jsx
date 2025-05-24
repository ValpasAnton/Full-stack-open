const Personlist = ( {personList, onDelete} ) => {
	return(
		<div>
			<h2>Numbers</h2>
      		<ul>
        		{personList.map(person => 
					<li key={person.id}>
						{person.name} {person.number}
						<button onClick={() => onDelete(person)}>delete</button>
					</li>
					 )
				}
      		</ul>
		</div>
	)
}

export default Personlist;