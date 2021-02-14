import createValidation from "@flasd/express-yup-middleware";
import * as Yup from "yup";

const validateSearch = createValidation({
  size: Yup.number(),
  query: Yup.string(),
  filter: Yup.object().shape({
    locationFilter: Yup.object().shape({
      distance: Yup.string().required(),
      location: Yup.object()
        .shape({
          lat: Yup.number().required(),
          lon: Yup.number().required(),
        })
        .required(),
    }),
    municipalityName: Yup.string(),
  }),
});

export default validateSearch;
