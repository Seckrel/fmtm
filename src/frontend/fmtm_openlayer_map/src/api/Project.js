import { ProjectActions } from "fmtm/ProjectSlice";
import CoreModules from "fmtm/CoreModules";
export const ProjectById = (url, existingProjectList) => {
  return async (dispatch) => {
    // dispatch(HomeActions.HomeProjectLoading(true))
    const fetchProjectById = async (url, existingProjectList) => {
      try {
        const project = await CoreModules.axios.get(url);
        const resp = project.data;
        console.log("loading :", project.data);
        const persistingValues = resp.project_tasks.map((data) => {
          return {
            id: data.id,
            project_task_name: data.project_task_name,
            task_status_str: data.task_status_str,
            outline_geojson: data.outline_geojson,
            outline_centroid: data.outline_centroid,
            task_history: data.task_history,
            locked_by_uid:data.locked_by_uid,
            locked_by_username:data.locked_by_username,
          };
        });

        // console.log("loading :", persistingValues);
        dispatch(
          ProjectActions.SetProjectTaskBoundries([
            { id: resp.id, taskBoundries: persistingValues },
          ])
        );
        dispatch(
          ProjectActions.SetProjectInfo({id:resp.id,
            priority:resp.priority || 2,
            priority_str:resp.priority_str || "MEDIUM",
            title:resp.project_info?.[0]?.name,
            location_str:resp.location_str,
            description:resp.description,
            num_contributors:resp.num_contributors,
            total_tasks:resp.total_tasks,
            tasks_mapped:resp.tasks_mapped,
            tasks_validated:resp.tasks_validated,
            tasks_bad:resp.tasks_bad})
        );
      } catch (error) {
        // console.log('error :', error)
      }
    };

    await fetchProjectById(url, existingProjectList);
    dispatch(ProjectActions.SetNewProjectTrigger());
  };
};
