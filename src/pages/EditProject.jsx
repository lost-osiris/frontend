import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TabPanel } from '../components/TabPanel'
import * as api from '~/api'
import { dispatchAlert } from '../store'

import { ProjectsContext, UserContext } from '../context'

import { ProjectMembers } from '../components/EditProject/ProjectMembers'
import { ProjectWebhooks } from '../components/EditProject/ProjectWebhooks'

import { Button, Tab, Grid, Tabs, Divider } from '@mui/material'

export const EditProject = () => {
  const { project } = useContext(ProjectsContext)
  const { user } = useContext(UserContext)
  const params = useParams()
  const navigate = useNavigate()
  const [blob, setBlob] = useState()
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    if (project && user.discord_id !== project.owner) {
      navigate('/')
    }
  }, [params.projectId, project])

  const handleTabChange = (_, tab) => {
    setTabValue(tab)
  }

  const updateBanner = () => {
    api.requests('put', `/api/project/${params.projectId}/updatebanner`, {
      alert: true,
      alertMessage: 'banner  updated',
      data: { file: blob, type: 'png' },
    })
  }

  return (
    <div>
      <Grid container>
        <Grid item lg={12} sx={{ mt: 5 }}>
          <Tabs onChange={handleTabChange} value={tabValue} variant='fullWidth'>
            <Tab id='manage-webhooks' label='Webhooks' />
            <Tab id='manage-members' label='Members' />
            <Tab id='manage-info' label='Info' />
          </Tabs>
          <Divider sx={{ mb: 2, mt: 2 }} />
          <TabPanel index={0} value={tabValue}>
            <ProjectWebhooks />
          </TabPanel>
          <TabPanel index={1} value={tabValue}>
            <ProjectMembers />
          </TabPanel>
          <TabPanel index={2} value={tabValue}>
            <Button component='label' variant='contained'>
              asdfasdf
              <input
                accept='.png, .jpg, .jpeg'
                hidden
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (file && file.size > 2 * 1024 * 1024) {
                    dispatchAlert({
                      message: 'Image must be less than 2MB',
                      type: 'error',
                    })
                  } else {
                    let image = new Blob([file], { type: file.type })
                    setBlob(image)
                  }
                }}
                type='file'
              />
            </Button>
            <Button onClick={updateBanner}> upload image</Button>
          </TabPanel>
        </Grid>
      </Grid>
    </div>
  )
}
