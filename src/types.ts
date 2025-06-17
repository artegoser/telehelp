import { Context as Ctx, Scenes } from "telegraf";

export interface Context<
  SSD extends object,
  S extends object | undefined = undefined
> extends Ctx {
  session: S & Scenes.SceneSession<Scenes.SceneSessionData & SSD>;
  scene: Scenes.SceneContextScene<
    Context<SSD, S>,
    Scenes.SceneSessionData & SSD
  >;
}

export interface WizardContext<
  SSD extends object,
  S extends object | undefined = undefined
> extends Ctx {
  session: S & Scenes.WizardSession<Scenes.WizardSessionData & SSD>;

  scene: Scenes.SceneContextScene<
    WizardContext<SSD, S>,
    Scenes.WizardSessionData & SSD
  >;

  wizard: Scenes.WizardContextWizard<WizardContext<SSD>>;
}
