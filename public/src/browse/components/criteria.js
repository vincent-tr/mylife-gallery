'use strict';

import { React, PropTypes, mui, formatDate, SummaryExpansionPanel, DateOrYearSelector, CriteriaField, DebouncedTextField } from 'mylife-tools-ui';
import TypeSelector from './type-selector';
import SortFieldSelector from './sort-field-selector';
import SortOrderSelector from './sort-order-selector';

const useSummaryStyles = mui.makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    marginRight: theme.spacing(4)
  }
}));

const ExpandedSummary = () => {
  const classes = useSummaryStyles();
  return (
    <div className={classes.container}>
      <mui.Typography variant='h6' className={classes.title}>Critères de sélection</mui.Typography>
    </div>
  );
};

ExpandedSummary.propTypes = {
};

const CollapsedSummary = ({ criteria }) => {
  const classes = useSummaryStyles();
  return (
    <div className={classes.container}>
      <mui.Typography className={classes.title}>{`Du ${format(criteria.minDate)} au ${format(criteria.maxDate)}`}</mui.Typography>
    </div>
  );
};

CollapsedSummary.propTypes = {
  criteria: PropTypes.object.isRequired
};

const WrappedCheckbox = ({ value, onChange, ...props }) => (
  <mui.Checkbox color='primary' checked={value} onChange={e => onChange(e.target.checked)} {...props} />
);

WrappedCheckbox.propTypes = {
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};

const GridSimpleField = ({ object, onObjectChanged, propName, label, editor, width, ...props }) => {
  let editorNode = null;
  if(editor) {
    const EditorComponent = editor;
    const setValue = (value) => onObjectChanged({ ...object, [propName]: value });
    editorNode = (
      <EditorComponent value={object[propName]} onChange={setValue} {...props} />
    );
  }

  return (
    <mui.Grid item xs={width}>
      <CriteriaField label={label}>
        {editorNode}
      </CriteriaField>
    </mui.Grid>
  );
};

GridSimpleField.propTypes = {
  width: PropTypes.number.isRequired,
  editor: PropTypes.elementType,
  object: PropTypes.object,
  onObjectChanged: PropTypes.func,
  propName: PropTypes.string
};

const useStyles = mui.makeStyles({
  selector: {
    minWidth: 160
  }
});

const Criteria = ({ className, criteria, onCriteriaChanged, display, onDisplayChanged }) => {
  const classes = useStyles();
  const grid = (
    <mui.Grid container spacing={2}>
      <GridSimpleField width={2} label='Date du document' />
      <GridSimpleField width={2} label='Début' editor={DateOrYearSelector} propName='minDate' object={criteria} onObjectChanged={onCriteriaChanged} showYearSelector />
      <GridSimpleField width={2} label='Début' editor={DateOrYearSelector} propName='maxDate' object={criteria} onObjectChanged={onCriteriaChanged} showYearSelector selectLastDay />

      <GridSimpleField width={2} label={'Date d\'intégration'} />
      <GridSimpleField width={2} label='Début' editor={DateOrYearSelector} propName='minIntegrationDate' object={criteria} onObjectChanged={onCriteriaChanged} showYearSelector />
      <GridSimpleField width={2} label='Début' editor={DateOrYearSelector} propName='maxIntegrationDate' object={criteria} onObjectChanged={onCriteriaChanged} showYearSelector selectLastDay />

      <GridSimpleField width={4} label='Type' editor={TypeSelector} propName='type' object={criteria} onObjectChanged={onCriteriaChanged} className={classes.selector}/>
      <GridSimpleField width={4} label='Albums' />
      <GridSimpleField width={4} label='Personnes' />

      <GridSimpleField width={4} label='Mots clés' editor={DebouncedTextField} propName='keywords' object={criteria} onObjectChanged={onCriteriaChanged} />
      <GridSimpleField width={4} label='Légende' editor={DebouncedTextField} propName='caption' object={criteria} onObjectChanged={onCriteriaChanged} />
      <GridSimpleField width={3} label='Chemin du fichier' editor={DebouncedTextField} propName='path' object={criteria} onObjectChanged={onCriteriaChanged} />
      <GridSimpleField width={1} label='Doublons' editor={WrappedCheckbox} propName='pathDuplicate' object={criteria} onObjectChanged={onCriteriaChanged} />

      <GridSimpleField width={2} label='Tri' editor={SortFieldSelector} propName='sortField' object={display} onObjectChanged={onDisplayChanged} className={classes.selector}/>
      <GridSimpleField width={3} label='' editor={SortOrderSelector} propName='sortOrder' object={display} onObjectChanged={onDisplayChanged} className={classes.selector}/>
    </mui.Grid>
  );

  return (
    <SummaryExpansionPanel
      className={className}
      expandedSummary={<ExpandedSummary criteria={criteria} display={display} />}
      collapsedSummary={<CollapsedSummary criteria={criteria} display={display} />}>
      {grid}
    </SummaryExpansionPanel>
  );
};

Criteria.propTypes = {
  className: PropTypes.string,
  criteria: PropTypes.object.isRequired,
  onCriteriaChanged: PropTypes.func.isRequired,
  display: PropTypes.object.isRequired,
  onDisplayChanged: PropTypes.func.isRequired
};

export default Criteria;

function format(date) {
  if(!date) {
    return '<indéfini>';
  }
  return formatDate(date, 'dd/MM/yyyy');
}
