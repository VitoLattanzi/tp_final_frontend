import React, { useEffect } from 'react'
import useFetch from '../../hooks/useFetch' 
import { getWorkspaces } from '../../services/workspaceService' 
import { Link } from 'react-router-dom';


const HomeScreen = () => {
  const {sendRequest, response, loading, error} = useFetch()

  useEffect( 
    ()=>{
      sendRequest(
        () => getWorkspaces()
      )
    },
    []
  )
  console.log(response, loading, error)
  return (
    <div>
      <h1>lista de espacio de trabajos</h1>
      {
        loading  
        ? <span>cargando...</span>
        : <div> 
          { response && response.data.workspaces.map(
            (workspace) => {
              return (
                <div>
                  <h1>los works</h1>
                  <h2>{workspace.workspace_name}</h2>
                  <Link to={'/workspace/' + workspace.workspace_id}>Abrir workspace</Link>
                </div>
              )
            }
          )
          } 
          </div>
      }
    </div>
  )
}

export default HomeScreen