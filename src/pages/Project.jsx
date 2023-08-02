import React, { useContext } from 'react'
import { Avatar, AvatarGroup, Grid } from '@mui/material/'
import { ProjectsContext } from '../context'
import Loading from '../components/Loading'

export const ProjectPage = () => {
  const { project } = useContext(ProjectsContext)

  if (!project) {
    return <Loading />
  }

  return (
    <div>
      <Grid container>
        <Grid item lg={12}>
          <img
            alt={project.name}
            src='https://static0.gamerantimages.com/wordpress/wp-content/uploads/2023/07/hollow-knight-pale-court.jpg'
            style={{
              maxHeight: '400px',
              maxWidth: '1600px',
              minHeight: '400px',
              minWidth: '1600px',
            }}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item lg={6}></Grid>
        <Grid item lg={6}>
          <AvatarGroup max={project.members.length}>
            {project.members.map((el, index) => {
              return (
                <Avatar
                  alt={el.username}
                  key={`${index}-${JSON.stringify(el.username)}`}
                  src={`https://cdn.discordapp.com/avatars/${el.discord_id}/${el.avatar}.png`}
                />
              )
            })}
          </AvatarGroup>
        </Grid>
      </Grid>
    </div>
  )
}

// <List
//   sx={{ bgcolor: 'background.paper', maxWidth: 250, width: '100%' }}
// >
//   {project.members.map((el) => {
//     return (
//       <div key={el.username}>
//         <ListItem alignItems='flex-start'>
//           <ListItemAvatar>
//             <Avatar
//               alt={el.username}
//               src={`https://cdn.discordapp.com/avatars/${el.discord_id}/${el.avatar}.png`}
//             />
//           </ListItemAvatar>
//           <ListItemText
//             primary={el.username}
//             secondary={
//               <React.Fragment>
//                 <Typography
//                   color='text.primary'
//                   component='span'
//                   sx={{ display: 'inline' }}
//                   variant='body2'
//                 >
//                   ROLE HERE
//                 </Typography>
//               </React.Fragment>
//             }
//           />
//         </ListItem>
//         <Divider component='li' variant='inset' />
//       </div>
//     )
//   })}
// </List>
