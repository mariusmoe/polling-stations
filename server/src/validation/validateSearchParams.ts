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
          lat: Yup.number(),
          lon: Yup.number(),
        })
        .required(),
    }),
    municipalityName: Yup.string(),
  }),
  place: Yup.string()
});

export default validateSearch;
