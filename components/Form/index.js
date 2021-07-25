import { Button, Grid, makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
    formContainer: {
        marginBottom: theme.spacing(1),
    }
  }));

export default function Form(props) {
  const classes = useStyles();
  return (
    <form onSubmit={props.onSubmit}> 
      
    <Grid container spacing={1} direction="row" justifyContent="center" alignItems="flex-start" className={classes.formContainer}> 
        <GridItems>
            {props.children}
        </GridItems>
        {props.submit && (
            <Grid key="submit" item xs={12}>
                <Button size="large" type="submit" variant="contained" color="primary" fullWidth disabled={props.disabled}>
                {props.submitText}
                </Button>
            </Grid>
        )}
    </Grid>
  </form>
  )
}

function GridItems(props) {
    return (
      <>
        {props.children.map((child) => <Grid key={child.props.id} item xs={12}>{child}</Grid>)}
      </>
    )
  }