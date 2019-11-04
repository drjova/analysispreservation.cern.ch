import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Box from "grommet/components/Box";
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";

import Label from "grommet/components/Label";
import Anchor from "grommet/components/Anchor";
import Header from "grommet/components/Header";
import AddIcon from "grommet/components/icons/base/Add";

import OauthPopup from "./components/OAuthPopup";
import { updateIntegrations } from "../../actions/auth";

const INTEGRATIONS = {
  github: {
    title: "Github",
    description: ""
  },
  gitlab: {
    title: "Gitlab CERN",
    description: ""
  },
  zenodo: {
    title: "Zenodo",
    description: ""
  },
  orcid: {
    title: "ORCiD",
    description: ""
  }
};

class Integrations extends React.Component {
  renderOAuthPopup(service) {
    let _url;
    if (process.env.NODE_ENV === "development")
      _url = `http://localhost:5000/auth/connect/${service}?ui=1`;
    else _url = `/api/auth/connect/${service}?ui=1`;

    return (
      <OauthPopup url={_url} loginCallBack={this.loginCallBack}>
          <div><Anchor icon={<AddIcon size="xsmall" />}
          label={<Label size="small" uppercase>connect</Label>}
      /></div>
                            
      </OauthPopup>
    );
  }

  loginCallBack = () => {
    this.props.updateIntegrations();
  };

    render() {
        return (
            <Box flex>
                <Box pad="none">
                    <Box
                        flex={true}
                        direction="row"
                        pad="small"
                    >
                        <Label
                            uppercase
                            align="start"
                            justify="center"
                            margin="none"
                        >
                            Integrations with other services
                        </Label>
                    </Box>
                </Box>
                <Box colorIndex="light-1" >
                    <Box>
                        <Box flex>
                            <List>
                                {Object.keys(INTEGRATIONS).map(service => (
                                    <ListItem key={service} justify="between">
                                        <Label size="small" uppercase>{INTEGRATIONS[service].title}</Label>
                                        {this.props.integrations && this.props.integrations[service]
                                                ? "Connected"
                                                : this.renderOAuthPopup(service)}
                                            </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Box>
                </Box>
            </Box>
    );
  }
}

Integrations.propTypes = {
  integrations: PropTypes.object,
  updateIntegrations: PropTypes.func
};

function mapStateToProps(state) {
  return {
    integrations: state.auth.get("integrations")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateIntegrations: () => dispatch(updateIntegrations())
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Integrations)
);