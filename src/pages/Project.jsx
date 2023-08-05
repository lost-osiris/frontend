import React, { useContext } from 'react'
import { Avatar, AvatarGroup, Grid } from '@mui/material/'
import { ProjectsContext } from '../context'
import Loading from '../components/Loading'
import HKVocalized from '../assets/CardImages/HKVocalized.png'
import PaleCourt from '../assets/CardImages/PaleCourt.jpg'
import SealedEchoes from '../assets/CardImages/SealedEchoes.jpg'

export const ProjectPage = () => {
  const { project } = useContext(ProjectsContext)
  let imageUrl

  if (!project) {
    return <Loading />
  }

  if (project.name === 'Hallownest Vocalized') {
    imageUrl = HKVocalized
  } else if (project.name === 'Pale Court') {
    imageUrl = PaleCourt
  } else if (project.name === 'Sealed Echoes') {
    imageUrl = SealedEchoes
  }

  return (
    <div>
      <Grid container>
        <Grid item lg={12}>
          <img
            alt={project.name}
            src={imageUrl}
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
