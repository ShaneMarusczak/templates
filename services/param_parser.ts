type BoxFunc = () => number | boolean;
interface BoxState {
  [index: string]: string | BoxFunc;
  newBox: string;
  deleteBox: string;
  editBox: string;
  newOn(): boolean;
  deleteOn(): boolean;
  editOn(): boolean;
  invalid(): boolean;
}

interface ParamState {
  [index: string]: string | BoxState;
  secretCode: string;
  templateName: string;
  templateArgString: string;
  newTemplateBody: string;
  boxState: BoxState;
}

export function parseParams(url: URL): ParamState {
  return {
    secretCode: getParam(url, "secretCode"),
    templateName: getParam(url, "templateName"),
    templateArgString: getParam(url, "templateArgStringInput"),
    newTemplateBody: getParam(url, "newtemplateBody"),
    boxState: {
      newBox: getParam(url, "newbox"),
      deleteBox: getParam(url, "deletebox"),
      editBox: getParam(url, "editbox"),
      newOn(): boolean {
        return this.newBox === "on";
      },
      deleteOn(): boolean {
        return this.deleteBox === "on";
      },
      editOn(): boolean {
        return this.editBox === "on";
      },
      invalid(): boolean {
        return (this.newBox + this.deleteBox + this.editBox).length > 2;
      },
    },
  };
}

function getParam(url: URL, name: string): string {
  return url.searchParams.get(name) || "";
}
