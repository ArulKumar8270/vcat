import { Link } from 'react-router-dom';
import styled from 'styled-components';
	
export const Header = styled.h1`
margin: 0;
padding: 0;
text-align: center;
color: green;
`;

export const Content = styled.div`
overflowY: scroll;
height: 700px;
`;

export const RouterLink = styled(Link)`
cursor: pointer;
transition: all 0.2s ease-in-out;
text-decoration: none;
`;

export const Button = styled.button`
padding: 20px;
font-size: 20px;
position: relative;
left: 42%;
margin: 20px;
cursor: pointer;
`;
