import { Scenes } from "telegraf";
import { WizardContext } from "./types";
import { nanoid } from "nanoid";

export type Validator<V> = (input: string) => ValidationResult<V>;

export interface ValidationResult<V> {
  value?: V;
  errorMessage?: string;
}

export interface FormStep<T extends object, V extends keyof T = keyof T> {
  field: V;
  prompt: string;
  validate: Validator<T[V]>;
}

export type FormContext<T extends object> = WizardContext<{
  form: T;
}>;

export type submitHandler<T extends object> = (
  ctx: FormContext<T>
) => Promise<void> | void;

/**
 * Creates a form scene with the specified steps and submission handler.
 * @param sceneId - The ID of the scene.
 * @param steps - The steps of the form.
 * @param onSubmit - The function to call when the form is submitted.
 * @returns The created form scene.
 */
export function createFormScene<T extends object>(
  sceneId: string,
  steps: FormStep<T>[],
  onSubmit?: submitHandler<T>
): Scenes.WizardScene<FormContext<T>> {
  const wizardSteps = steps.map(
    (step, index) => async (ctx: FormContext<T>) => {
      if (ctx.text) {
        const validationResult = step.validate(ctx.text);
        if (validationResult?.value) {
          ctx.scene.session.form[step.field] = validationResult.value;
          if (index < steps.length - 1) {
            await ctx.reply(steps[index + 1].prompt);
            return ctx.wizard.next();
          } else {
            await onSubmit?.(ctx);
            ctx.scene.session.form = {} as T; // Clear the form after submission
            return ctx.scene.leave();
          }
        } else if (validationResult?.errorMessage) {
          await ctx.reply(validationResult.errorMessage);
        }
      }
    }
  );

  return new Scenes.WizardScene(
    sceneId,
    async (ctx) => {
      if (steps.length > 0) {
        await ctx.reply(steps[0].prompt);
      }

      ctx.scene.session.form = {} as T;

      return ctx.wizard.next();
    },
    ...wizardSteps
  );
}

/**
 * Creates a form with the specified steps and submission handler.
 * @param steps - The steps of the form.
 * @param onSubmit - The function to call when the form is submitted.
 * @param idLength - The length of the ID to generate.
 * @returns The created form scene.
 */
export function createForm<T extends object>(
  steps: FormStep<T>[],
  onSubmit?: submitHandler<T>,
  idLength: number = 10
) {
  let id = nanoid(idLength);
  return createFormScene(id, steps, onSubmit);
}
