'use client';

import { useEffect, useState } from 'react';
import Headline from "components/Headline";
import db from '../../../database';
import { User } from '../../../models';

function Button({ text }: { text: string }) {
	return (
		<button className="h-32 w-40 whitespace-normal text-wrap rounded-3xl border-2 border-borderSeparatorColor bg-borderBackgroundColor p-2">
			{text}
		</button>
	);
}

export default function AdminHome() {
	const buttons = [
		"Neues Layout erstellen",
		"Eigene Vorlage hochladen",
		"Mit typischer Vorlage starten",
	];

	// State to hold user data
	const [users, setUsers] = useState<User[]>([]);

	// Fetch data from the database
	useEffect(() => {
		async function fetchData() {
			await db.sync();

			// Create a new user (for demonstration purposes)
			const newUser = await db.models.User.create({
				name: 'Admin User',
				email: 'admin@example.com',
			});

			console.log('Neuer Admin-Benutzer erstellt:', newUser);

			// Retrieve all users from the database
			const users = await db.models.User.findAll();
			setUsers(users);
		}

		fetchData();
	}, []);

	return (
		<div className="flex flex-col items-center justify-center">
			<div>
				<Headline className="w-full flex-grow">
					<h1 className="text-4xl font-medium">Admin Management</h1>
				</Headline>
				<p className="mx-72 mb-12 text-center">
					Erstellen Sie ein neues Supermarkt-Layout ganz nach Ihren
					Vorstellung, laden Sie eigene Layouts hoch oder nutzen Sie
					eine typische Vorlage, um Zeit zu sparen und Inspiration zu
					erhalten.
				</p>
			</div>
			<div className="flex items-center justify-center space-x-16">
				{buttons.map((e, index) => (
					<Button key={index} text={e} />
				))}
			</div>
			<div className="mt-12">
				<h2 className="text-2xl font-medium">Benutzerliste:</h2>
				<ul>
					{users.map((user) => (
						<li key={user.id}>{user.name} - {user.email}</li>
					))}
				</ul>
			</div>
		</div>
	);
}
