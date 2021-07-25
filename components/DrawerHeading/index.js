import { Typography } from "@material-ui/core";

export default function DrawerHeading(props) {
  return (
    <Typography variant="h5" component="h2" gutterBottom>
    {props.heading}
    </Typography>
  )
}