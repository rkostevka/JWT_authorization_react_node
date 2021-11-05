import { observer } from "mobx-react-lite";
import { FC, useContext, useState } from "react";
import { Context } from "..";


const LoginForm: FC = () => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const {store} = useContext(Context);

	return (
		<div className="App">
			<div className="container-form">
				<div className="about">
					JWT access, refresh authorization for node js and react. Email
					confirmation. Activating mail on node js.
				</div>
				<div className="form">
					<input
						onChange={(e) => setEmail(e.target.value)}
						value={email}
						type="text"
						placeholder="Email"
					/>
					<input
						onChange={(e) => setPassword(e.target.value)}
						value={password}
						type="password"
						placeholder="password"
					/>
					<button
						className="button"
						onClick={() => store.login(email, password)}
					>
						Login
					</button>
					<button
						className="button"
						onClick={() => store.register(email, password)}
					>
						Registration
					</button>
				</div>
			</div>
		</div>
	);
}

export default observer(LoginForm);