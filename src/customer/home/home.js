import React, {useCallback, useEffect} from 'react';
import clsx from 'clsx';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import LeftCategory from "./left.panel";
import CategoryIcon from '@material-ui/icons/Category';
import Header from "./header";
import {useDispatch, useSelector} from "react-redux";
import {setFoodList, setLogin, setLoginUser} from "../../actions";
import {findFakeFoodsByCategory, findFoodsByCategory} from "../service/food.search.service";
import {Route} from "react-router-dom";
import Link from "@material-ui/core/Link";
import DialogContent from "@material-ui/core/DialogContent";
import ShoppingCart from "./right.panel";
import Dialog from "@material-ui/core/Dialog";


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(9) + 1,
    },
    drawerTitleWrapper: {
        display: 'flex',
        alignItems: 'center'
    },
    drawerTitle: {
        fontWeight: 'bold',
        padding: theme.spacing(0, 2)
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        marginTop: theme.spacing(2)
    },
    footer: {
        padding: theme.spacing(6),
        backgroundColor: theme.palette.background.paper,
    }
}));

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright ?? '}
            <Link color="inherit" href="">
                Huskies
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function Home(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = useCallback(() => {
        if (document.documentElement.clientWidth >= 600) {
            setOpen(true);
        }
    }, []);
    // wjc ?????? props???????????????
    const selectedCategory = useSelector(state => state.selectedCategory)
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const isLogin = useSelector(state => state.isLogin)
    useEffect(() => {
        findFoodsByCategory(selectedCategory)
            .then(foodList => {
                dispatch(setFoodList(foodList))
            })
    }, [selectedCategory])

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user")) || undefined
        const isLogin = localStorage.getItem("isLogin") || false
        if (user !== undefined && isLogin !== false) {
            dispatch(setLoginUser(user))
            dispatch(setLogin(isLogin))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("isLogin", isLogin)
    }, [user, isLogin])

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <Header drawerStatus={open} handleDrawerOpen={handleDrawerOpen}/>
            <Drawer variant="permanent"
                    className={clsx(classes.drawer, {[classes.drawerOpen]: open, [classes.drawerClose]: !open,})}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}>
                <div className={classes.toolbar}>
                    <div className={classes.drawerTitleWrapper}>
                        <CategoryIcon/>
                        <Typography variant="h6" className={classes.drawerTitle}>
                            Category
                        </Typography>
                    </div>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                    </IconButton>
                </div>
                <Divider/>
                <LeftCategory/>
                <Divider/>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar}/>
                {
                    props.routes.map((item, index) => {
                        return <Route key={index} exact path={item.path} component={item.component}/>
                    })
                }
                <footer className={classes.footer}>
                    <Typography variant="h6" align="center" gutterBottom>
                        Restaurant Manager
                    </Typography>
                    <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                        Northeastern University Students
                    </Typography>
                    <Copyright/>
                </footer>
            </main>
        </div>
    );
}
