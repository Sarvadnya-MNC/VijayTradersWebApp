import React from 'react';
import { ReactComponent as Home} from './svgicons/home.svg';
import { ReactComponent as Notebook} from './svgicons/notebook.svg';
import { ReactComponent as User} from './svgicons/user.svg';


const iconStore = {
    home : <Home/>,
    notebook:<Notebook/>,
    user:<User/>
}

export default iconStore;